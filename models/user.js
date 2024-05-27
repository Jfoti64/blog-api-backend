const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  user_name: { type: String, required: true, unique: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
  author_status: { type: Boolean, required: true, default: false },
  admin: { type: Boolean, default: false },
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual for user's full name
UserSchema.virtual('full_name').get(function () {
  return `${this.family_name}, ${this.first_name}`;
});

// Virtual for user's URL
UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model('User', UserSchema);
