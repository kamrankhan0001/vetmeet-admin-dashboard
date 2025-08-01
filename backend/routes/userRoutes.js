
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, syncUserProfile } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware'); // This still relies on Firebase ID token

router.route('/profile')
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

router.post('/sync-profile', authenticate, syncUserProfile);

module.exports = router;