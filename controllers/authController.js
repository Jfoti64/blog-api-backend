const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User login
exports.login = [
  body('user_name').trim().isLength({ min: 1 }).escape(),
  body('password').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ user_name: req.body.user_name });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, isAdmin: user.admin, user });
  })
];

// User logout
exports.logout = asyncHandler(async (req, res, next) => {
  // Handle logout (e.g., invalidate token)
  res.status(200).json({ message: 'User logged out successfully' });
});

// Middleware to protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
});

// Middleware to restrict access to admin users
exports.restrictToAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  next();
};

// Get current logged in user
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});