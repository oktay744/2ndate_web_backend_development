import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema(
  {
    firstPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    secondPersonId: {
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