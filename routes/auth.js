// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate verification token (add this to utils/emailVerification.js)
    const verificationToken = generateVerificationToken();
    
    const user = new User({
      email,
      password: await bcrypt.hash(password, 12),
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 3600000 // 1 hour
    });

    await user.save();

    // Send verification email (implement this in services/emailService.js)
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User created! Check email for verification.' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' }); // Generic error
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// routes/auth.js
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});
