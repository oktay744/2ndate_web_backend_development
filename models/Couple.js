import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      trim: true,
      default: null
    },
    partnerName: {
      type: String,
      trim: true,
      default: null
    },
    inviteKey: {
      type: String,
      required: true,
      unique: true,
    },
    userAnswers: {
      type: Map,
      of: String,
      required: true,
    },
    partnerAnswers: {
      type: Map,
      of: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    }
  },
  { timestamps: true }
);

export default mongoose.model('Couple', coupleSchema);