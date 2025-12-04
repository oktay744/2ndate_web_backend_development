import express from 'express';
import { createAnalysis, getLatestAnalysis } from '../controllers/analysis.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, createAnalysis);
router.get('/my', verifyToken, getLatestAnalysis);

export default router;