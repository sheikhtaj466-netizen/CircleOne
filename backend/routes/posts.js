const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/posts
// @desc    Create a post (Yeh same rahega)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      user: req.user.id,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// -------------------------------------------------------------------
// YAHAN PAR HUMNE CODE BADLA HAI
// -------------------------------------------------------------------
// @route   GET api/posts
// @desc    Get posts from followed users
// @access  Private 
router.get('/', auth, async (req, res) => {
  try {
    // Logged-in user ki details nikalo
    const currentUser = await User.findById(req.user.id);

    // User jinhe follow karta hai, unki ID ki list banao
    const followingIds = currentUser.following.map(follow => follow.user);

    // Is list me apni khud ki ID bhi jodo, taaki apne posts bhi dikhein
    followingIds.push(req.user.id);

    // Ab database se sirf unhi users ke posts nikalo jinki ID is list me hai
    const posts = await Post.find({ user: { $in: followingIds } }).sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... (baaki ka code 'like' aur 'comment' wala same rahega) ...
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.some((like) => like.user.toString() === req.user.id)) {
            post.likes = post.likes.filter(
                ({ user }) => user.toString() !== req.user.id
            );
        } else {
            post.likes.unshift({ user: req.user.id });
        }
        await post.save();
        res.json(post.likes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/comment/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
