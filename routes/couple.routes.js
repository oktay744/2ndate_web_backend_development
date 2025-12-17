import express from 'express';
import { createInvite, getInvite, completeInvite, getCoupleResult, getMyInvites } from '../controllers/couple.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/invite', verifyToken, createInvite);
router.get('/myInvites', verifyToken, getMyInvites);
router.get('/:inviteKey', getInvite); 
router.post('/:inviteKey/complete', completeInvite);
router.get('/:inviteKey/result', getCoupleResult);

export default router;