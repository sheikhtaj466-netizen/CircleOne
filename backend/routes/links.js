const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');

// @route   GET api/links
// @desc    Get all user's links
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ date: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/links
// @desc    Add a new link
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, url, description } = req.body;
  try {
    const newLink = new Link({
      title,
      url,
      description,
      user: req.user.id,
    });
    const link = await newLink.save();
    res.json(link);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/links/:id
// @desc    Delete a link
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let link = await Link.findById(req.params.id);
        if (!link) return res.status(404).json({ msg: 'Link not found' });
        if (link.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Link.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Link removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
