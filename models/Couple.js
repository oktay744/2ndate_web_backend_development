import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    partnerName: {
      type: String,
      default: null
    },
    inviteKey: {
      type: String,
      required: true,
      unique: true
    },
    partnerAnswers: {
      type: Object,
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