const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

// REGISTER - Create new user in MongoDB
router.post('/register', async (req, res) => {
  try {
    console.log('═══════════════════════════════════');
    console.log('📝 REGISTRATION REQUEST RECEIVED');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Database:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState); // Should be 1
    console.log('═══════════════════════════════════');

    const { firebaseUid, email, name, profilePicture } = req.body;

    // Validate required fields
    if (!firebaseUid) {
      console.error('❌ Missing firebaseUid');
      return res.status(400).json({ message: 'Missing firebaseUid' });
    }
    if (!email) {
      console.error('❌ Missing email');
      return res.status(400).json({ message: 'Missing email' });
    }
    if (!name) {
      console.error('❌ Missing name');
      return res.status(400).json({ message: 'Missing name' });
    }

    console.log('✅ All required fields present');

    // Check if user already exists
    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({ 
      $or: [{ email }, { firebaseUid }] 
    });

    if (existingUser) {
      console.log('ℹ️ User already exists:', existingUser._id);
      return res.status(200).json({ 
        message: 'User already exists',
        user: existingUser 
      });
    }

    console.log('✅ No existing user found, creating new user...');

    // Create new user
    const newUser = new User({
      firebaseUid,
      email,
      name,
      profilePicture: profilePicture || '',
      headline: '',
      bio: '',
      isProfileComplete: false,
    });

    console.log('💾 Attempting to save user to database...');
    console.log('User data:', {
      firebaseUid: newUser.firebaseUid,
      email: newUser.email,
      name: newUser.name,
    });

    // CRITICAL: Actually save to database
    const savedUser = await newUser.save();

    console.log('═══════════════════════════════════');
    console.log('✅ SUCCESS! USER SAVED TO DATABASE');
    console.log('User ID:', savedUser._id);
    console.log('Email:', savedUser.email);
    console.log('Firebase UID:', savedUser.firebaseUid);
    console.log('Database:', mongoose.connection.name);
    console.log('Collection:', savedUser.collection.name);
    console.log('═══════════════════════════════════');

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        firebaseUid: savedUser.firebaseUid,
        email: savedUser.email,
        name: savedUser.name,
        profilePicture: savedUser.profilePicture,
        headline: savedUser.headline,
        bio: savedUser.bio,
        isProfileComplete: savedUser.isProfileComplete,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    });

  } catch (error) {
    console.log('═══════════════════════════════════');
    console.error('❌ ERROR CREATING USER');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.code === 11000) {
      console.error('Duplicate key error - which field:', error.keyPattern);
      console.error('Duplicate value:', error.keyValue);
    }
    console.error('Full error:', error);
    console.log('═══════════════════════════════════');

    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message,
      code: error.code,
      details: error.toString()
    });
  }
});

module.exports = router;
