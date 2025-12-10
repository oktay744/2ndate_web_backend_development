import mongoose from 'mongoose';

const userAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    answers: {
      type: Map,
      of: String,
      required: true,
    },
    profile: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('UserAnalysis', userAnalysisSchema);