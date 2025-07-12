const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../utils/auth');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Logout user
router.post('/logout', requireAuth, authController.logout);

// Get user profile
router.get('/profile', requireAuth, authController.getProfile);

module.exports = router; 