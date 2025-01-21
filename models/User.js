// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date
});

module.exports = mongoose.model('User', userSchema);
