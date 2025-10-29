const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  members: [{ // Is conversation me kaun se do users hain
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
}, { timestamps: true });

module.exports = mongoose.model('conversation', ConversationSchema);
