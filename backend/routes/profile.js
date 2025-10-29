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
  } catch (err) { res.status(500).send('Server Error'); }
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
    } catch (err) { res.status(500).send("Server Error"); }
});

// -------------------------------------------------------------------
// YAHAN SE NAYA CODE SHURU HO RAHA HAI
// -------------------------------------------------------------------
// @route   PUT api/profile/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.put('/unfollow/:id', auth, async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        // Check karo ki user pehle se follow hai bhi ya nahi
        if (!currentUser.following.some(follow => follow.user.toString() === req.params.id)) {
            return res.status(400).json({ msg: "You don't follow this user" });
        }

        // Dono users ki list se ID hata do
        currentUser.following = currentUser.following.filter(({ user }) => user.toString() !== req.params.id);
        userToUnfollow.followers = userToUnfollow.followers.filter(({ user }) => user.toString() !== req.user.id);

        await currentUser.save();
        await userToUnfollow.save();

        res.json(currentUser.following);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ... (baaki ka code 'GET /user/:user_id' se lekar aakhir tak same rahega) ...
router.get('/user/:user_id', auth, async (req, res) => {
    try {
        const profile = await User.findById(req.params.user_id).select('-password');
        if(!profile) return res.status(404).json({ msg: 'Profile not found' });
        const posts = await Post.find({ user: req.params.user_id }).sort({ date: -1 });
        res.json({ profile, posts });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/', auth, async (req, res) => {
    try {
        const searchQuery = req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {};
        const profiles = await User.find(searchQuery).select('-password');
        res.json(profiles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

