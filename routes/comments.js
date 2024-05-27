const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

// Comment routes
router.get('/', commentController.index); // List all comments for a specific post
router.post('/', authController.protect, commentController.create); // Create a new comment for a specific post
router.get('/:commentId', authController.protect, commentController.show); // Get a single comment by ID
router.put('/:commentId', authController.protect, authController.restrictToAdmin, commentController.update); // Update a comment by ID
router.delete('/:commentId', authController.protect, authController.restrictToAdmin, commentController.delete); // Delete a comment by ID

module.exports = router;
