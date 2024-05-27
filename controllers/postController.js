const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate('user').populate('comments');
  res.json(posts);
});

// Create a new post
exports.create = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('post_text').trim().isLength({ min: 1 }).escape(),
  body('user').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = new Post({
      title: req.body.title,
      post_text: req.body.post_text,
      user: req.body.user,
      timestamp: Date.now(),
    });

    await post.save();
    res.status(201).json(post);
  })
];

// Get a single post by ID
exports.show = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('user').populate('comments');
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

// Update post by ID
exports.update = [
  body('title').trim().optional().isLength({ min: 1 }).escape(),
  body('post_text').optional().trim().isLength({ min: 1 }).escape(),
  body('user').trim().optional().isLength({ min: 1 }).escape(),
  body('timestamp').optional().escape(),
  body('published').isBoolean().optional(), 

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postData = {
      title: req.body.title,
      post_text: req.body.post_text,
      user: req.body.user,
      timestamp: req.body.timestamp,
      published: req.body.published,
    };

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, postData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  })
];

// Delete post by ID
exports.delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Post deleted successfully' });
});