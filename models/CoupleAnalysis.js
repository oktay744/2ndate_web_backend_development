import mongoose from 'mongoose';

const coupleAnalysisSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    partnerName: {
      type: String,
      default: null,
      trim: true,
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
    coupleResult: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('CoupleAnalysis', coupleAnalysisSchema);
