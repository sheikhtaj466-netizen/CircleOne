const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all user's tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
// @desc    Add a new task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({
      text: req.body.text,
      user: req.user.id,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task (mark as complete/incomplete)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        task.isCompleted = !task.isCompleted; // Status ko ulta kar do
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
