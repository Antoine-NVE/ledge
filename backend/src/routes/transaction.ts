import express from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { db } from '../config/db';
import { SecurityMiddleware } from '../middlewares/SecurityMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { env } from '../config/env';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { TransactionService } from '../services/TransactionService';

const router = express.Router();

const transactionRepository = new TransactionRepository(db.collection('transactions'));
const transactionService = new TransactionService(transactionRepository);
const transactionController = new TransactionController(transactionService);
const userRepository = new UserRepository(db.collection('users'));
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
const userService = new UserService(jwtService, emailService, userRepository);
const securityMiddleware = new SecurityMiddleware(userService, transactionService, jwtService);

router.post('/', securityMiddleware.authenticateUser, transactionController.create);
router.get('/', securityMiddleware.authenticateUser, transactionController.readMany);
router.get(
    '/:id',
    securityMiddleware.authenticateUser,
    securityMiddleware.authorizeTransaction,
    transactionController.read,
);
router.put(
    '/:id',
    securityMiddleware.authenticateUser,
    securityMiddleware.authorizeTransaction,
    transactionController.update,
);
router.delete(
    '/:id',
    securityMiddleware.authenticateUser,
    securityMiddleware.authorizeTransaction,
    transactionController.delete,
);

export default router;
