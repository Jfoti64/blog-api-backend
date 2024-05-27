const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentsRouter = require('./comments');
const authController = require('../controllers/authController');

// Post routes
router.get('/', postController.index); // List all posts
router.post('/', authController.protect, authController.restrictToAdmin, postController.create); // Create a new post
router.get('/:id', postController.show); // Get a single post by ID
router.put('/:id', authController.protect, authController.restrictToAdmin, postController.update); // Update a post by ID
router.delete('/:id', authController.protect, authController.restrictToAdmin, postController.delete); // Delete a post by ID

// Nested comment routes
router.use('/:postId/comments', commentsRouter); // Mount the commentsRouter

module.exports = router;
