const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// ... (puraana saara code 'GET api/profile/me' se lekar 'PUT api/profile/follow/:id' tak same rahega) ...
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select('-password');
    const posts = await Post.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ profile, posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/follow/:id', auth, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        if (req.params.id === req.user.id) {
            return res.status(400).json({ msg: "You cannot follow yourself" });
        }
        if (currentUser.following.some(follow => follow.user.toString() === req.params.id)) {
            return res.status(400).json({ msg: "You already follow this user" });
        }
        currentUser.following.unshift({ user: req.params.id });
        userToFollow.followers.unshift({ user: req.user.id });
        await currentUser.save();
        await userToFollow.save();
        res.json(currentUser.following);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/user/:user_id', auth, async (req, res) => {
    try {
        const profile = await User.findById(req.params.user_id).select('-password');
        if(!profile) return res.status(404).json({ msg: 'Profile not found' });
        const posts = await Post.find({ user: req.params.user_id }).sort({ date: -1 });
        res.json({ profile, posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// -------------------------------------------------------------------
// YAHAN SE NAYA CODE SHURU HO RAHA HAI
// -------------------------------------------------------------------
// @route   GET api/profile
// @desc    Get all profiles
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profiles = await User.find().select('-password');
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
