const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require('../models/post');
const asyncHandler = require("express-async-handler");

// List all comments for a specific post
exports.index = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('user');
  res.json(comments);
});

// Create a new comment for a specific post
exports.create = [
  body('comment_text').trim().isLength({ min: 1 }).escape(),
  body('user').trim().isLength({ min: 1 }).escape(), // Assuming user is passed as a user ID

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const comment = new Comment({
        comment_text: req.body.comment_text,
        user: req.body.user,
        post: req.params.postId,
      });

      const savedComment = await comment.save();
      post.comments.push(savedComment._id);
      await post.save();

      res.status(201).json(savedComment);
    } catch (error) {
      next(error);
    }
  })
];

// Get a single comment by ID
exports.show = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).populate('user').populate('post');
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }
  res.json(comment);
});

// Update a comment by ID
exports.update = [
  body('comment_text').trim().isLength({ min: 1 }).escape(),
  body('user').trim().optional().isLength({ min: 1 }).escape(),
  body('timestamp').optional().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commentData = {
      comment_text: req.body.comment_text,
      user: req.body.user,
      timestamp: req.body.timestamp,
    };

    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, commentData, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(updatedComment);
  })
];

// Delete a comment by ID
exports.delete = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  // Optionally, remove the comment from the associated post's comments array
  await Post.updateMany({}, { $pull: { comments: commentId } });
  
  await Comment.findByIdAndDelete(commentId);
  res.status(200).json({ message: 'Comment deleted successfully' });
});
