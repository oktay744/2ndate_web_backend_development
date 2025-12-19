import express from 'express';
import { createInvite, getInvite, completeInvite, getCoupleResult, getMyInvites, linkCoupleAccount } from '../controllers/couple.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/invite', verifyToken, createInvite);
router.post('/link-account', verifyToken, linkCoupleAccount);
router.get('/myInvites', verifyToken, getMyInvites);
router.get('/:inviteKey', getInvite);
router.post('/:inviteKey/complete', completeInvite);
router.get('/:inviteKey/result', getCoupleResult);

export default router;