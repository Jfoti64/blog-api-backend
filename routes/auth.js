const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes
router.post('/login', authController.login); // User login
router.post('/logout', authController.logout); // User logout
router.get('/me', authController.protect, authController.getCurrentUser); // Get current logged in user

module.exports = router;
