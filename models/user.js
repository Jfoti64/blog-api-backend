const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// User routes
router.get('/', authController.protect, authController.restrictToAdmin, userController.index); // List all users
router.post('/', userController.create); // Create a new user
router.get('/:id', authController.protect, userController.show); // Get a single user by ID
router.put('/:id', authController.protect, authController.restrictToAdmin, userController.update); // Update a user by ID
router.delete('/:id', authController.protect, authController.restrictToAdmin, userController.delete); // Delete a user by ID

module.exports = router;
