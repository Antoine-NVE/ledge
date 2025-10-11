import express from 'express';

import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserRepository } from '../repositories/UserRepository';
import { env } from '../config/env';
import { db } from '../config/db';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { SecurityMiddleware } from '../middlewares/SecurityMiddleware';
import { TransactionService } from '../services/TransactionService';
import { container } from '../config/container';

const router = express.Router();

const { authenticateUser } = container.securityMiddleware;
const { sendVerificationEmail, verifyEmail, me } = container.userController;

router.post('/send-verification-email', authenticateUser, sendVerificationEmail);
router.post('/verify-email', verifyEmail);
router.get('/me', authenticateUser, me);

export default router;
