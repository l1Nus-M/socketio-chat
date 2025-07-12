const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/auth');
const { rooms } = require('../config/database');

// Get all rooms
router.get('/', requireAuth, (req, res) => {
  try {
    const allRooms = Array.from(rooms.values());
    res.json({ rooms: allRooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get room by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const room = rooms.get(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new room
router.post('/', requireAuth, (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const roomId = name.toLowerCase().replace(/\s+/g, '-');
    
    if (rooms.has(roomId)) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    const newRoom = {
      id: roomId,
      name,
      description: description || '',
      createdBy: req.user.id,
      createdAt: new Date(),
      messages: []
    };

    rooms.set(roomId, newRoom);
    res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 