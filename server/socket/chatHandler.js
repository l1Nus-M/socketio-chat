const Message = require('../models/Message');
const User = require('../models/User');
const { messages, rooms, typingUsers } = require('../config/database');

class ChatHandler {
  constructor(io) {
    this.io = io;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.user?.username || 'Anonymous'}`);

      // Join default room
      socket.join('general');
      
      // Update user online status
      if (socket.user) {
        socket.user.isOnline = true;
        socket.user.lastSeen = new Date();
        this.broadcastUserStatus(socket.user, true);
      }

      // Handle joining rooms
      socket.on('join_room', (roomId) => {
        this.handleJoinRoom(socket, roomId);
      });

      // Handle leaving rooms
      socket.on('leave_room', (roomId) => {
        this.handleLeaveRoom(socket, roomId);
      });

      // Handle sending messages
      socket.on('send_message', (data) => {
        this.handleSendMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing_stop', (data) => {
        this.handleTypingStop(socket, data);
      });

      // Handle message reactions
      socket.on('add_reaction', (data) => {
        this.handleAddReaction(socket, data);
      });

      socket.on('remove_reaction', (data) => {
        this.handleRemoveReaction(socket, data);
      });

      // Handle read receipts
      socket.on('mark_read', (data) => {
        this.handleMarkRead(socket, data);
      });

      // Handle private messages
      socket.on('send_private_message', (data) => {
        this.handlePrivateMessage(socket, data);
      });

      // Handle file uploads
      socket.on('upload_file', (data) => {
        this.handleFileUpload(socket, data);
      });

      // Handle message editing
      socket.on('edit_message', (data) => {
        this.handleEditMessage(socket, data);
      });

      // Handle message deletion
      socket.on('delete_message', (data) => {
        this.handleDeleteMessage(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  handleJoinRoom(socket, roomId) {
    if (!socket.user) return;

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    socket.join(roomId);
    socket.user.rooms.push(roomId);

    // Send room history
    const roomMessages = Message.findByRoom(roomId, 50);
    socket.emit('room_history', {
      roomId,
      messages: roomMessages.map(msg => ({
        ...msg.toJSON(),
        sender: User.findById(msg.senderId)?.toJSON()
      }))
    });

    // Notify others
    socket.to(roomId).emit('user_joined', {
      user: socket.user.toJSON(),
      roomId
    });

    console.log(`${socket.user.username} joined room: ${roomId}`);
  }

  handleLeaveRoom(socket, roomId) {
    if (!socket.user) return;

    socket.leave(roomId);
    const roomIndex = socket.user.rooms.indexOf(roomId);
    if (roomIndex > -1) {
      socket.user.rooms.splice(roomIndex, 1);
    }

    socket.to(roomId).emit('user_left', {
      user: socket.user.toJSON(),
      roomId
    });

    console.log(`${socket.user.username} left room: ${roomId}`);
  }

  handleSendMessage(socket, data) {
    if (!socket.user) return;

    const { content, roomId, replyTo } = data;

    if (!content || !roomId) {
      socket.emit('error', { message: 'Message content and room ID are required' });
      return;
    }

    const message = new Message(socket.user.id, content, roomId);
    if (replyTo) {
      message.replyTo = replyTo;
    }

    // Save message
    messages.set(message.id, message);

    // Broadcast to room
    const messageData = {
      ...message.toJSON(),
      sender: socket.user.toJSON()
    };

    this.io.to(roomId).emit('new_message', messageData);

    // Send notification to users not in the room
    this.sendNotificationToOfflineUsers(socket.user, messageData);

    console.log(`Message sent by ${socket.user.username} in ${roomId}: ${content}`);
  }

  handleTypingStart(socket, data) {
    if (!socket.user) return;

    const { roomId } = data;
    const key = `${roomId}-${socket.user.id}`;
    typingUsers.set(key, {
      userId: socket.user.id,
      username: socket.user.username,
      roomId,
      timestamp: new Date()
    });

    socket.to(roomId).emit('user_typing', {
      userId: socket.user.id,
      username: socket.user.username,
      roomId
    });
  }

  handleTypingStop(socket, data) {
    if (!socket.user) return;

    const { roomId } = data;
    const key = `${roomId}-${socket.user.id}`;
    typingUsers.delete(key);

    socket.to(roomId).emit('user_stopped_typing', {
      userId: socket.user.id,
      username: socket.user.username,
      roomId
    });
  }

  handleAddReaction(socket, data) {
    if (!socket.user) return;

    const { messageId, reaction } = data;
    const message = Message.findById(messageId);

    if (!message) {
      socket.emit('error', { message: 'Message not found' });
      return;
    }

    message.addReaction(socket.user.id, reaction);
    messages.set(messageId, message);

    // Broadcast reaction
    this.io.emit('message_reaction_added', {
      messageId,
      userId: socket.user.id,
      username: socket.user.username,
      reaction
    });
  }

  handleRemoveReaction(socket, data) {
    if (!socket.user) return;

    const { messageId } = data;
    const message = Message.findById(messageId);

    if (!message) {
      socket.emit('error', { message: 'Message not found' });
      return;
    }

    message.removeReaction(socket.user.id);
    messages.set(messageId, message);

    // Broadcast reaction removal
    this.io.emit('message_reaction_removed', {
      messageId,
      userId: socket.user.id
    });
  }

  handleMarkRead(socket, data) {
    if (!socket.user) return;

    const { messageId } = data;
    const message = Message.findById(messageId);

    if (!message) {
      socket.emit('error', { message: 'Message not found' });
      return;
    }

    message.markAsRead(socket.user.id);
    messages.set(messageId, message);

    // Notify sender
    const senderSocket = this.getSocketByUserId(message.senderId);
    if (senderSocket) {
      senderSocket.emit('message_read', {
        messageId,
        readBy: socket.user.id,
        username: socket.user.username
      });
    }
  }

  handlePrivateMessage(socket, data) {
    if (!socket.user) return;

    const { recipientId, content } = data;
    const recipient = User.findById(recipientId);

    if (!recipient) {
      socket.emit('error', { message: 'Recipient not found' });
      return;
    }

    // Create private room ID
    const privateRoomId = this.getPrivateRoomId(socket.user.id, recipientId);
    
    const message = new Message(socket.user.id, content, privateRoomId);
    messages.set(message.id, message);

    const messageData = {
      ...message.toJSON(),
      sender: socket.user.toJSON()
    };

    // Send to recipient
    const recipientSocket = this.getSocketByUserId(recipientId);
    if (recipientSocket) {
      recipientSocket.emit('private_message', messageData);
    }

    // Send back to sender
    socket.emit('private_message', messageData);

    // Send notification
    this.sendPrivateMessageNotification(socket.user, recipient, messageData);
  }

  handleFileUpload(socket, data) {
    if (!socket.user) return;

    const { fileUrl, fileName, fileType, roomId } = data;

    const message = new Message(socket.user.id, fileUrl, roomId, 'file');
    message.fileName = fileName;
    message.fileType = fileType;

    messages.set(message.id, message);

    const messageData = {
      ...message.toJSON(),
      sender: socket.user.toJSON(),
      fileName,
      fileType
    };

    this.io.to(roomId).emit('new_message', messageData);
  }

  handleEditMessage(socket, data) {
    if (!socket.user) return;

    const { messageId, newContent } = data;
    const message = Message.findById(messageId);

    if (!message) {
      socket.emit('error', { message: 'Message not found' });
      return;
    }

    // Check if user owns the message
    if (message.senderId !== socket.user.id) {
      socket.emit('error', { message: 'You can only edit your own messages' });
      return;
    }

    message.edit(newContent);
    messages.set(messageId, message);

    // Broadcast edited message
    this.io.emit('message_edited', {
      messageId,
      newContent,
      editedAt: message.editedAt
    });
  }

  handleDeleteMessage(socket, data) {
    if (!socket.user) return;

    const { messageId } = data;
    const message = Message.findById(messageId);

    if (!message) {
      socket.emit('error', { message: 'Message not found' });
      return;
    }

    // Check if user owns the message
    if (message.senderId !== socket.user.id) {
      socket.emit('error', { message: 'You can only delete your own messages' });
      return;
    }

    messages.delete(messageId);

    // Broadcast message deletion
    this.io.emit('message_deleted', { messageId });
  }

  handleDisconnect(socket) {
    if (socket.user) {
      socket.user.isOnline = false;
      socket.user.lastSeen = new Date();
      this.broadcastUserStatus(socket.user, false);
    }

    // Clear typing indicators
    for (const [key, typingData] of typingUsers) {
      if (typingData.userId === socket.user?.id) {
        typingUsers.delete(key);
        socket.to(typingData.roomId).emit('user_stopped_typing', {
          userId: socket.user.id,
          username: socket.user.username,
          roomId: typingData.roomId
        });
      }
    }

    console.log(`User disconnected: ${socket.user?.username || 'Anonymous'}`);
  }

  broadcastUserStatus(user, isOnline) {
    this.io.emit('user_status_changed', {
      userId: user.id,
      username: user.username,
      isOnline,
      lastSeen: user.lastSeen
    });
  }

  sendNotificationToOfflineUsers(sender, messageData) {
    // This would typically integrate with a notification service
    // For now, we'll just log it
    console.log(`Notification sent for message from ${sender.username}`);
  }

  sendPrivateMessageNotification(sender, recipient, messageData) {
    // This would typically integrate with a notification service
    console.log(`Private message notification sent to ${recipient.username}`);
  }

  getSocketByUserId(userId) {
    for (const [id, socket] of this.io.sockets.sockets) {
      if (socket.user && socket.user.id === userId) {
        return socket;
      }
    }
    return null;
  }

  getPrivateRoomId(user1Id, user2Id) {
    const sortedIds = [user1Id, user2Id].sort();
    return `private_${sortedIds[0]}_${sortedIds[1]}`;
  }
}

module.exports = ChatHandler; 