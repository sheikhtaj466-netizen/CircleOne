const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Humne apne "gatekeeper" ko import kiya
const Note = require('../models/Note'); // Note model ko import kiya
const User = require('../models/User'); // User model ko import kiya

// @route   GET api/notes
// @desc    Get all users notes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Sirf uss user ke notes dhoondo jo logged in hai
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notes
// @desc    Add a new note
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      user: req.user.id, // Logged-in user ki ID ko note se jodo
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    // Check karo ki note usi user ka hai jo use delete kar raha hai
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
