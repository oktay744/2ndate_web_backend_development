import express from 'express';
import { saveAnswers, getAnswers } from '../controllers/answers.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/save-answers', verifyToken, saveAnswers);
router.get('/get-answers', verifyToken, getAnswers);

export default router;