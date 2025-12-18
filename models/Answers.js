import mongoose from 'mongoose';

const answersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    answers: {
      type: Object,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Answers', answersSchema);