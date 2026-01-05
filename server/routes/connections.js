const express = require('express');
const router = express.Router();

// Send connection request (NO DATABASE - Just returns success)
router.post('/send', async (req, res) => {
  try {
    const { senderId, senderName, receiverId, receiverName, message } = req.body;

    console.log('🔗 Connection request received:', { senderId, receiverId });

    if (!senderId || !senderName || !receiverId || !receiverName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    // Return success without database
    res.status(201).json({
      message: 'Connection request sent successfully',
      connection: {
        _id: 'temp_' + Date.now(),
        senderId,
        senderName,
        receiverId,
        receiverName,
        message: message || '',
        status: 'pending',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ Error sending connection request:', error);
    res.status(500).json({ 
      message: 'Error sending connection request',
      error: error.message 
    });
  }
});

// Get connection status
router.get('/status/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    console.log('🔍 Checking connection status:', userId1, userId2);

    // Return no connection for now
    res.json({ 
      status: 'none',
      connection: null,
      isPending: false,
      isConnected: false,
      isSender: false,
    });
  } catch (error) {
    console.error('❌ Error checking connection status:', error);
    res.status(500).json({ message: 'Error checking connection status' });
  }
});

// Get all connections
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔍 Fetching connections for user:', userId);
    res.json([]);
  } catch (error) {
    console.error('❌ Error fetching connections:', error);
    res.status(500).json({ message: 'Error fetching connections' });
  }
});

// Accept connection
router.put('/accept/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    console.log('✅ Accepting connection:', connectionId);

    res.json({
      message: 'Connection request accepted',
      connection: {
        _id: connectionId,
        status: 'accepted',
      },
    });
  } catch (error) {
    console.error('❌ Error accepting connection:', error);
    res.status(500).json({ message: 'Error accepting connection' });
  }
});

module.exports = router;
