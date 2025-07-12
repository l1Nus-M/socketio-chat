// In-memory storage for development
// In production, you would use a real database like MongoDB or PostgreSQL

const users = new Map();
const messages = new Map();
const rooms = new Map();
const typingUsers = new Map();

// Initialize default rooms
rooms.set('general', {
  id: 'general',
  name: 'General',
  description: 'General chat room',
  createdBy: 'system',
  createdAt: new Date(),
  messages: []
});

rooms.set('random', {
  id: 'random',
  name: 'Random',
  description: 'Random chat room',
  createdBy: 'system',
  createdAt: new Date(),
  messages: []
});

module.exports = {
  users,
  messages,
  rooms,
  typingUsers
}; 