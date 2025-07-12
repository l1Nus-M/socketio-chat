import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (user && token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      newSocket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('room_history', (data) => {
        setMessages(data.messages);
      });

      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
      });

      newSocket.on('user_stopped_typing', (data) => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      });

      newSocket.on('user_joined', (data) => {
        console.log(`${data.user.username} joined the room`);
      });

      newSocket.on('user_left', (data) => {
        console.log(`${data.user.username} left the room`);
      });

      newSocket.on('user_status_changed', (data) => {
        setOnlineUsers(prev => {
          const existing = prev.find(u => u.id === data.userId);
          if (existing) {
            return prev.map(u => 
              u.id === data.userId 
                ? { ...u, isOnline: data.isOnline, lastSeen: data.lastSeen }
                : u
            );
          } else {
            return [...prev, { id: data.userId, username: data.username, isOnline: data.isOnline, lastSeen: data.lastSeen }];
          }
        });
      });

      newSocket.on('message_reaction_added', (data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, reactions: { ...msg.reactions, [data.userId]: data.reaction } }
            : msg
        ));
      });

      newSocket.on('message_reaction_removed', (data) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === data.messageId) {
            const newReactions = { ...msg.reactions };
            delete newReactions[data.userId];
            return { ...msg, reactions: newReactions };
          }
          return msg;
        }));
      });

      newSocket.on('message_read', (data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, readBy: [...msg.readBy, data.readBy] }
            : msg
        ));
      });

      newSocket.on('message_edited', (data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, content: data.newContent, isEdited: true, editedAt: data.editedAt }
            : msg
        ));
      });

      newSocket.on('message_deleted', (data) => {
        setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const sendMessage = (content, roomId = currentRoom, replyTo = null) => {
    if (socket && content.trim()) {
      socket.emit('send_message', { content, roomId, replyTo });
    }
  };

  const startTyping = (roomId = currentRoom) => {
    if (socket) {
      socket.emit('typing_start', { roomId });
    }
  };

  const stopTyping = (roomId = currentRoom) => {
    if (socket) {
      socket.emit('typing_stop', { roomId });
    }
  };

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId);
      setCurrentRoom(roomId);
      setMessages([]);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', roomId);
    }
  };

  const addReaction = (messageId, reaction) => {
    if (socket) {
      socket.emit('add_reaction', { messageId, reaction });
    }
  };

  const removeReaction = (messageId) => {
    if (socket) {
      socket.emit('remove_reaction', { messageId });
    }
  };

  const markAsRead = (messageId) => {
    if (socket) {
      socket.emit('mark_read', { messageId });
    }
  };

  const sendPrivateMessage = (recipientId, content) => {
    if (socket && content.trim()) {
      socket.emit('send_private_message', { recipientId, content });
    }
  };

  const value = {
    socket,
    connected,
    messages,
    typingUsers,
    onlineUsers,
    currentRoom,
    rooms,
    sendMessage,
    startTyping,
    stopTyping,
    joinRoom,
    leaveRoom,
    addReaction,
    removeReaction,
    markAsRead,
    sendPrivateMessage,
    setMessages,
    setRooms
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 