const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// List all users
exports.index = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

// Create a new user
exports.create = [
  body('first_name').trim().isLength({ min: 1 }).escape(),
  body('family_name').trim().isLength({ min: 1 }).escape(),
  body('user_name').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      user_name: req.body.user_name,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json(user);
  })
];

// Get a single user by ID
exports.show = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Update a user by ID
exports.update = [
  body('first_name').optional().trim().isLength({ min: 1 }).escape(),
  body('family_name').optional().trim().isLength({ min: 1 }).escape(),
  body('user_name').optional().trim().isLength({ min: 1 }).escape(),
  body('password').optional().trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData = {
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      user_name: req.body.user_name,
    };

    if (req.body.password) {
      userData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, userData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  })
];

// Delete a user by ID
exports.delete = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted successfully' });
});
