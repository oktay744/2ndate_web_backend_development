import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      default: null
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);