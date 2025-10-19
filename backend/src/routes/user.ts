import express from 'express';
import { container } from '../config/container';

const router = express.Router();

const { authenticateUser } = container.securityMiddleware;
const { sendVerificationEmail, verifyEmail, me } = container.userController;

router.post(
    '/send-verification-email',
    authenticateUser,
    sendVerificationEmail,
);
router.post('/verify-email', verifyEmail);
router.get('/me', authenticateUser, me);

export default router;
