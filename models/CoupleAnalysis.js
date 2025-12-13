import mongoose from 'mongoose';

const coupleAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
