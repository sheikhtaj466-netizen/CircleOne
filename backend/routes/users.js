const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/users (Register a user) - Yeh same rahega
router.post('/', async (req, res) => {
  // ... (puraana registration wala poora code yahan same rahega) ...
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) { return res.status(400).json({ msg: 'Is email se user pehle se registered hai' }); }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
    });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// -------------------------------------------------------------------
// YAHAN SE NAYA CODE SHURU HO RAHA HAI
// -------------------------------------------------------------------
// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;

