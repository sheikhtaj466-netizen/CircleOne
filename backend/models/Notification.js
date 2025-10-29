const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  // Jisko notification milega
  recipient: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  // Jisne notification bheja
  sender: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  // Notification ka type (like, comment, follow)
  type: { type: String, required: true, enum: ['like', 'comment', 'follow'] },
  // Agar post se juda hai, toh post ki ID
  postId: { type: Schema.Types.ObjectId, ref: 'post' },
  // Notification padha gaya ya nahi
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('notification', NotificationSchema);
