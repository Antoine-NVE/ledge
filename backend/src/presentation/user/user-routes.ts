import express from 'express';
import { container } from '../../infrastructure/config/container';

const router = express.Router();

const { authenticate } = container.accessMiddleware;
const { sendVerificationEmail, verifyEmail, me } = container.userController;

router.post('/send-verification-email', authenticate, sendVerificationEmail);
router.post('/verify-email', verifyEmail);
router.get('/me', authenticate, me);

export default router;
