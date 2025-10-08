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

const router = express.Router();

const jwtService = new JwtService(env.JWT_SECRET);
const emailService = new EmailService(
    env.SMTP_HOST,
    env.SMTP_PORT,
    env.SMTP_SECURE,
    {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
    env.EMAIL_FROM,
);
const userRepository = new UserRepository(db.collection('users'));
const userService = new UserService(jwtService, emailService, userRepository);
const userController = new UserController(userService);
const transactionRepository = new TransactionRepository(db.collection('transactions'));
const transactionService = new TransactionService(transactionRepository);
const securityMiddleware = new SecurityMiddleware(userService, transactionService, jwtService);

router.post(
    '/send-email-verification-email',
    securityMiddleware.authenticateUser,
    userController.sendEmailVerificationEmail,
);
router.post('/verify-email', userController.verifyEmail);
router.get('/me', securityMiddleware.authenticateUser, userController.me);

export default router;
