
const User = require('../models/User'); // MongoDB User model

// @desc    Get authenticated user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: 'User profile not found in database. Please ensure your profile is synced.' });
    }

    const sanitizedUser = {
      _id: user._id,
      firebaseUid: user.firebaseUid,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      blocked: user.blocked || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({ message: 'Profile fetched successfully', user: sanitizedUser });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// @desc    Update authenticated user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { displayName, email, phone } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    if (displayName !== undefined) user.displayName = displayName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    user.updatedAt = Date.now();

    const updatedUser = await user.save();

    const sanitizedUser = {
      _id: updatedUser._id,
      firebaseUid: updatedUser.firebaseUid,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      blocked: updatedUser.blocked || false,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.json({ message: 'Profile updated successfully', user: sanitizedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// @desc    Sync user profile from Firebase Auth to MongoDB
// @route   POST /api/users/sync-profile
// @access  Private (authenticated via Firebase ID token)
const syncUserProfile = async (req, res) => {
  const { uid, email, displayName, phone_number } = req.user;

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      user.email = email || user.email;
      user.displayName = displayName || user.displayName;
      user.phone = phone_number || user.phone;
      user.updatedAt = Date.now();
      await user.save();

      return res.status(200).json({
        message: 'User profile synced (updated).',
        user: {
          _id: user._id,
          firebaseUid: user.firebaseUid,
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          blocked: user.blocked || false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        isNewUser: false,
      });
    } else {
      const newUser = new User({
        firebaseUid: uid,
        email: email || '',
        displayName: displayName || 'New User',
        phone: phone_number || '',
        role: 'user',
      });

      await newUser.save();

      return res.status(201).json({
        message: 'User profile synced (created).',
        user: {
          _id: newUser._id,
          firebaseUid: newUser.firebaseUid,
          displayName: newUser.displayName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          blocked: newUser.blocked || false,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        isNewUser: true,
      });
    }
  } catch (error) {
    console.error(`Error syncing user ${uid} to MongoDB:`, error);
    res.status(500).json({ message: 'Server error during sync.', details: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  syncUserProfile,
};
