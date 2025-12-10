import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import userAnalysisRoutes from './routes/userAnalysis.routes.js';

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
app.use('/api/analysis', userAnalysisRoutes);

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