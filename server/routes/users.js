const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-__v');
    console.log('✅ Retrieved all users:', users.length);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// SEARCH USERS
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    console.log('🔍 Backend: Searching users for:', q);

    if (!q || q.trim().length < 2) {
      console.log('⚠️ Query too short');
      return res.json([]);
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    const users = await User.find({
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { headline: { $regex: searchRegex } },
        { bio: { $regex: searchRegex } },
      ],
    })
      .select('firebaseUid name email profilePicture headline bio createdAt')
      .limit(20)
      .lean();

    console.log('✅ Backend: Found', users.length, 'users');
    res.json(users);
  } catch (error) {
    console.error('❌ Backend: User search error:', error);
    res.status(500).json({ 
      error: 'Search failed', 
      message: error.message 
    });
  }
});

// GET USER by Firebase UID
router.get('/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    
    if (!user) {
      console.log('❌ User not found:', req.params.firebaseUid);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user._id);
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// COMPLETE PROFILE
router.post('/complete-profile', async (req, res) => {
  try {
    console.log('📝 Complete profile request received:', req.body);

    const { firebaseUid, name, headline, bio, profilePicture } = req.body;

    if (!firebaseUid) {
      console.error('❌ Missing firebaseUid');
      return res.status(400).json({ message: 'Missing firebaseUid' });
    }
    if (!name || !headline || !bio) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { name: !!name, headline: !!headline, bio: !!bio }
      });
    }

    console.log('🔍 Looking for user with firebaseUid:', firebaseUid);

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      {
        name,
        headline,
        bio,
        profilePicture: profilePicture || '',
        isProfileComplete: true,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.error('❌ User not found:', firebaseUid);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Profile completed successfully:', {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      isComplete: updatedUser.isProfileComplete
    });

    res.json({
      message: 'Profile completed successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('❌ Error completing profile:', error);
    res.status(500).json({ 
      message: 'Error completing profile',
      error: error.message 
    });
  }
});

// UPDATE USER (Basic Info)
router.put('/:firebaseUid', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User updated:', updatedUser._id);
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// ✅ NEW: ADD EXPERIENCE
router.post('/:firebaseUid/experience', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.experience.push(req.body);
    await user.save();

    console.log('✅ Experience added');
    res.json(user);
  } catch (error) {
    console.error('❌ Error adding experience:', error);
    res.status(500).json({ message: 'Error adding experience', error: error.message });
  }
});

// ✅ NEW: UPDATE EXPERIENCE
router.put('/:firebaseUid/experience/:experienceId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const expIndex = user.experience.findIndex(
      (exp) => exp._id.toString() === req.params.experienceId
    );

    if (expIndex === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    user.experience[expIndex] = { ...user.experience[expIndex].toObject(), ...req.body };
    await user.save();

    console.log('✅ Experience updated');
    res.json(user);
  } catch (error) {
    console.error('❌ Error updating experience:', error);
    res.status(500).json({ message: 'Error updating experience' });
  }
});

// ✅ NEW: DELETE EXPERIENCE
router.delete('/:firebaseUid/experience/:experienceId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.experience = user.experience.filter(
      (exp) => exp._id.toString() !== req.params.experienceId
    );
    await user.save();

    console.log('✅ Experience deleted');
    res.json(user);
  } catch (error) {
    console.error('❌ Error deleting experience:', error);
    res.status(500).json({ message: 'Error deleting experience' });
  }
});

// ✅ NEW: ADD EDUCATION
router.post('/:firebaseUid/education', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.education.push(req.body);
    await user.save();

    console.log('✅ Education added');
    res.json(user);
  } catch (error) {
    console.error('❌ Error adding education:', error);
    res.status(500).json({ message: 'Error adding education', error: error.message });
  }
});

// ✅ NEW: UPDATE EDUCATION
router.put('/:firebaseUid/education/:educationId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const eduIndex = user.education.findIndex(
      (edu) => edu._id.toString() === req.params.educationId
    );

    if (eduIndex === -1) {
      return res.status(404).json({ message: 'Education not found' });
    }

    user.education[eduIndex] = { ...user.education[eduIndex].toObject(), ...req.body };
    await user.save();

    console.log('✅ Education updated');
    res.json(user);
  } catch (error) {
    console.error('❌ Error updating education:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
});

// ✅ NEW: DELETE EDUCATION
router.delete('/:firebaseUid/education/:educationId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.education = user.education.filter(
      (edu) => edu._id.toString() !== req.params.educationId
    );
    await user.save();

    console.log('✅ Education deleted');
    res.json(user);
  } catch (error) {
    console.error('❌ Error deleting education:', error);
    res.status(500).json({ message: 'Error deleting education' });
  }
});

// ✅ NEW: ADD PROJECT
router.post('/:firebaseUid/projects', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.projects.push(req.body);
    await user.save();

    console.log('✅ Project added');
    res.json(user);
  } catch (error) {
    console.error('❌ Error adding project:', error);
    res.status(500).json({ message: 'Error adding project', error: error.message });
  }
});

// ✅ NEW: UPDATE PROJECT
router.put('/:firebaseUid/projects/:projectId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const projIndex = user.projects.findIndex(
      (proj) => proj._id.toString() === req.params.projectId
    );

    if (projIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    user.projects[projIndex] = { ...user.projects[projIndex].toObject(), ...req.body };
    await user.save();

    console.log('✅ Project updated');
    res.json(user);
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// ✅ NEW: DELETE PROJECT
router.delete('/:firebaseUid/projects/:projectId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.projects = user.projects.filter(
      (proj) => proj._id.toString() !== req.params.projectId
    );
    await user.save();

    console.log('✅ Project deleted');
    res.json(user);
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// ✅ NEW: ADD SKILL
router.post('/:firebaseUid/skills', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { skill } = req.body;
    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }

    console.log('✅ Skill added');
    res.json(user);
  } catch (error) {
    console.error('❌ Error adding skill:', error);
    res.status(500).json({ message: 'Error adding skill' });
  }
});

// ✅ NEW: DELETE SKILL
router.delete('/:firebaseUid/skills/:skill', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = user.skills.filter((s) => s !== req.params.skill);
    await user.save();

    console.log('✅ Skill deleted');
    res.json(user);
  } catch (error) {
    console.error('❌ Error deleting skill:', error);
    res.status(500).json({ message: 'Error deleting skill' });
  }
});

// ✅ NEW: ADD CERTIFICATION
router.post('/:firebaseUid/certifications', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.certifications.push(req.body);
    await user.save();

    console.log('✅ Certification added');
    res.json(user);
  } catch (error) {
    console.error('❌ Error adding certification:', error);
    res.status(500).json({ message: 'Error adding certification', error: error.message });
  }
});

// ✅ NEW: UPDATE CERTIFICATION
router.put('/:firebaseUid/certifications/:certificationId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const certIndex = user.certifications.findIndex(
      (cert) => cert._id.toString() === req.params.certificationId
    );

    if (certIndex === -1) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    user.certifications[certIndex] = { ...user.certifications[certIndex].toObject(), ...req.body };
    await user.save();

    console.log('✅ Certification updated');
    res.json(user);
  } catch (error) {
    console.error('❌ Error updating certification:', error);
    res.status(500).json({ message: 'Error updating certification' });
  }
});

// ✅ NEW: DELETE CERTIFICATION
router.delete('/:firebaseUid/certifications/:certificationId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.certifications = user.certifications.filter(
      (cert) => cert._id.toString() !== req.params.certificationId
    );
    await user.save();

    console.log('✅ Certification deleted');
    res.json(user);
  } catch (error) {
    console.error('❌ Error deleting certification:', error);
    res.status(500).json({ message: 'Error deleting certification' });
  }
});

// Similar routes for licenses, languages, volunteer, publications, awards...
// (I can provide these if needed, but they follow the same pattern)

// DELETE USER
router.delete('/:firebaseUid', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ 
      firebaseUid: req.params.firebaseUid 
    });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User deleted:', deletedUser._id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
