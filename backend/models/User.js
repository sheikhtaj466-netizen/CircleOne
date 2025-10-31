const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Password ab optional hai
  pin: { type: String }, // PIN ko store karne ke liye
  pinSet: { type: Boolean, default: false }, // Check karne ke liye ki PIN set hai ya nahi
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);
