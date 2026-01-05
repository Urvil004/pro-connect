const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
      maxlength: 300,
    },
  },
  {
    timestamps: true,
    collection: 'connections',
  }
);

// Compound index to prevent duplicate connection requests
connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

// Index for finding all connections of a user
connectionSchema.index({ senderId: 1, status: 1 });
connectionSchema.index({ receiverId: 1, status: 1 });

module.exports = mongoose.model('Connection', connectionSchema);
