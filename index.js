import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import answersRoutes from './routes/answers.routes.js';
import coupleRoutes from './routes/couple.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://2ndate.co",
    "https://www.2ndate.co"
  ],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/couple', coupleRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`2ndate running on port ${PORT}`);
    });
  } catch (err) {
    process.exit(1);
  }
}

start();