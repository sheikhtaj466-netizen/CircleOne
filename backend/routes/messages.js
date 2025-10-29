const router = require("express").Router();
const Message = require("../models/Message");
const auth = require('../middleware/auth');

// Naya message add karna
router.post("/", auth, async (req, res) => {
  const newMessage = new Message({
      ...req.body,
      sender: req.user.id
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Ek conversation ke saare messages get karna
router.get("/:conversationId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
