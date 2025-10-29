const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// @route   GET api/habits
// @desc    Get all user's habits
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(habits);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/habits
// @desc    Add a new habit
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newHabit = new Habit({
      name: req.body.name,
      user: req.user.id,
    });
    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/habits/track/:id
// @desc    Track a habit for today
// @access  Private
router.put('/track/:id', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const today = new Date().setHours(0,0,0,0);

        // Check karo ki aaj ke liye pehle se track hai ya nahi
        const alreadyTracked = habit.completions.some(
            (completion) => new Date(completion.date).setHours(0,0,0,0) === today
        );

        if (alreadyTracked) {
            // Agar hai, toh completion hata do (un-track)
            habit.completions = habit.completions.filter(
                (completion) => new Date(completion.date).setHours(0,0,0,0) !== today
            );
        } else {
            // Agar nahi hai, toh aaj ki date add kar do
            habit.completions.push({ date: new Date() });
        }

        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
