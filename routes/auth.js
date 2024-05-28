// routes/auth.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Use userController for creating a user
const authController = require('../controllers/authController');

// Authentication routes
router.post('/signup', userController.create); // User signup
router.post('/login', authController.login); // User login
router.post('/logout', authController.logout); // User logout
router.get('/me', authController.protect, authController.getCurrentUser); // Get current logged in user

module.exports = router;
