const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: { // Yeh message kaunsi conversation ka hai
    type: String,
  },
  sender: { // Message bhejne wala kaun hai
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('message', MessageSchema);
