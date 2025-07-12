const { users } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(username, email, password) {
    this.id = this.generateId();
    this.username = username;
    this.email = email;
    this.password = password;
    this.avatar = this.generateAvatar();
    this.isOnline = false;
    this.lastSeen = new Date();
    this.createdAt = new Date();
    this.rooms = ['general'];
    this.privateChats = new Set();
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  generateAvatar() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://ui-avatars.com/api/?name=${this.username}&background=${randomColor.replace('#', '')}&color=fff&size=128`;
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  generateToken() {
    return jwt.sign(
      { id: this.id, username: this.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen,
      createdAt: this.createdAt,
      rooms: this.rooms
    };
  }

  static findByUsername(username) {
    for (const [id, user] of users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  static findById(id) {
    return users.get(id) || null;
  }

  static getAllOnline() {
    return Array.from(users.values()).filter(user => user.isOnline);
  }
}

module.exports = User; 