const router = require("express").Router();
const Conversation = require("../models/Conversation");
const auth = require('../middleware/auth');

// Nayi conversation shuru karna (Updated Logic)
router.post("/", auth, async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.body.receiverId;

  try {
    // Check karo ki in dono users ke beech conversation pehle se hai ya nahi
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    // Agar conversation mil gayi, toh usko wapas bhej do
    if (conversation) {
      return res.status(200).json(conversation);
    }

    // Agar nahi mili, toh nayi banao
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// User ki saari conversations get karna (Yeh same rahega)
router.get("/", auth, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user.id] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
