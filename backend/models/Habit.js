const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  // Har habit ki completions ki dates store karenge
  completions: [{
    date: {
      type: Date,
    }
  }],
  streak: {
    type: Number,
    default: 0, // Shuru me har habit ka streak 0 hoga
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('habit', HabitSchema);
