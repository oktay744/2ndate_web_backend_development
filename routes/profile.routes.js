import express from 'express';
import { saveAnswers, getAnswers } from '../controllers/profile.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, saveAnswers);
router.get('/my', verifyToken, getAnswers);

export default router;