const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false, // Shuru me har task incomplete hoga
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('task', TaskSchema);
