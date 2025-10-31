const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); // PIN ko hash karne ke liye
const User = require('../models/User');
const auth = require('../middleware/auth'); // Gatekeeper ko import kiya

// Magic Link Bhejna (Pehle jaisa hi)
router.post('/magic-link', async (req, res) => { /* ... iska code same rahega ... */ });

// --- YAHAN SE NAYA CODE SHURU HO RAHA HAI ---

// @route   POST api/auth/set-pin
// @desc    Set a user's PIN for the first time
// @access  Private
router.post('/set-pin', auth, async (req, res) => {
    const { pin } = req.body;
    if(!pin || pin.length < 4 || pin.length > 6){
        return res.status(400).json({ msg: 'PIN must be between 4 and 6 digits.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if(user.pinSet) return res.status(400).json({ msg: 'PIN is already set.' });

        const salt = await bcrypt.genSalt(10);
        user.pin = await bcrypt.hash(pin, salt);
        user.pinSet = true;
        await user.save();

        res.json({ msg: 'PIN set successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login-pin
// @desc    Login with email and PIN
// @access  Public
router.post('/login-pin', async (req, res) => {
    const { email, pin } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.pinSet) {
            return res.status(400).json({ msg: 'Invalid credentials or PIN not set.' });
        }

        const isMatch = await bcrypt.compare(pin, user.pin);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Magic Link wala code yahan paste karein
router.post('/magic-link', async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const name = email.split('@')[0];
      user = new User({ name, email });
      await user.save();
    }
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const magicLink = `https://circle-one-steel.vercel.app/verify-login?token=${token}`;
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    const mailOptions = { from: process.env.EMAIL_USER, to: email, subject: 'Your Magic Login Link', html: `<a href="${magicLink}">Log In Now</a>`};
    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Login link sent.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
