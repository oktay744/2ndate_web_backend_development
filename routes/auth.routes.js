import express from 'express';
import { signup, login, logout, checkAuth, updateName } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, checkAuth);
router.post('/update-name', verifyToken, updateName);

export default router;