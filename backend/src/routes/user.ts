import express from 'express';

import { getUser, sendVerificationEmail, verifyEmail } from '../controllers/user';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/send-verification-email', authenticate, sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', authenticate, getUser);

export default router;
