const express = require('express');
const router = express.Router();

// @route   POST api/auth
// @desc    Temporary test login
// @access  Public
router.post('/', async (req, res) => {
  // Isse koi fark nahi padta ki email/password kya hai
  // Yeh hamesha ek fake token bhejega
  res.json({ token: 'this-is-a-fake-test-token-12345' });
});

module.exports = router;
