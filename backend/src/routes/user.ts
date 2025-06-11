import express from 'express';

import { getUser, sendVerificationEmail } from '../controllers/user';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/send-verification-email', authenticate, sendVerificationEmail);
router.get('/me', authenticate, getUser);

export default router;
