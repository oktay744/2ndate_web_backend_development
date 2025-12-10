import express from 'express';
import { saveAnalysis, getAnalysis } from '../controllers/userAnalysis.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, saveAnalysis);
router.get('/my', verifyToken, getAnalysis);

export default router;