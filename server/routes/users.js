const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/auth');
const User = require('../models/User');

// Get all online users
router.get('/online', requireAuth, (req, res) => {
  try {
    const onlineUsers = User.getAllOnline();
    res.json({ users: onlineUsers });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/', requireAuth, (req, res) => {
  try {
    const allUsers = Array.from(User.users.values()).map(user => user.toJSON());
    res.json({ users: allUsers });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 