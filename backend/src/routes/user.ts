import express from 'express';

import { me, sendEmailVerificationEmail, verifyEmail } from '../controllers/user';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/send-email-verification-email', authenticate, sendEmailVerificationEmail);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', authenticate, me);

export default router;
