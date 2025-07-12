const { messages } = require('../config/database');

class Message {
  constructor(senderId, content, roomId, messageType = 'text') {
    this.id = this.generateId();
    this.senderId = senderId;
    this.content = content;
    this.roomId = roomId;
    this.messageType = messageType; // text, image, file
    this.timestamp = new Date();
    this.readBy = new Set();
    this.reactions = new Map(); // userId -> reaction
    this.replyTo = null; // for reply messages
    this.isEdited = false;
    this.editedAt = null;
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  markAsRead(userId) {
    this.readBy.add(userId);
  }

  addReaction(userId, reaction) {
    this.reactions.set(userId, reaction);
  }

  removeReaction(userId) {
    this.reactions.delete(userId);
  }

  edit(newContent) {
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      content: this.content,
      roomId: this.roomId,
      messageType: this.messageType,
      timestamp: this.timestamp,
      readBy: Array.from(this.readBy),
      reactions: Object.fromEntries(this.reactions),
      replyTo: this.replyTo,
      isEdited: this.isEdited,
      editedAt: this.editedAt
    };
  }

  static findById(id) {
    return messages.get(id) || null;
  }

  static findByRoom(roomId, limit = 50) {
    const roomMessages = Array.from(messages.values())
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return roomMessages.slice(-limit);
  }

  static findBySender(senderId, limit = 20) {
    return Array.from(messages.values())
      .filter(msg => msg.senderId === senderId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

module.exports = Message; 