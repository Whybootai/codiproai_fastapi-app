// utils/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token expiration time
  });
};

module.exports = { generateToken };
