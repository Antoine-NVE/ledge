import express from 'express';

import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/authenticate';
import { UserService } from '../services/UserService';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserRepository } from '../repositories/UserRepository';
import UserModel from '../models/User';
import { env } from '../config/env';

const router = express.Router();

const jwtService = new JwtService(env.JWT_SECRET);
const emailService = new EmailService({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});
const userRepository = new UserRepository(UserModel);
const userService = new UserService(jwtService, emailService, userRepository);
const userController = new UserController(userService);

router.post('/send-email-verification-email', authenticate, userController.sendEmailVerificationEmail);
router.get('/verify-email/:token', userController.verifyEmail);
router.get('/me', authenticate, userController.me);

export default router;
