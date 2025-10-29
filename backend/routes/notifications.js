const router = require("express").Router();
const Notification = require("../models/Notification");
const auth = require('../middleware/auth');

// @route   GET api/notifications
// @desc    Get all of user's notifications
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    }).populate('sender', 'name').sort({ createdAt: -1 }); // 'sender' ka naam bhi saath me bhej rahe hain

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
