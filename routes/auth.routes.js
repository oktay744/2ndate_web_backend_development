import express from 'express';
import { signup, login, logout, checkAuth, updateProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, checkAuth);
router.post('/name', verifyToken, updateProfile);

export default router;