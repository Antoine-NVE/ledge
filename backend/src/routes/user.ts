import express from 'express';

import { UserController } from '../controllers/UserController';
import authenticate from '../middlewares/authenticate';
import { UserService } from '../services/UserService';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserRepository } from '../repositories/UserRepository';
import UserModel from '../models/User';

const router = express.Router();

const jwtService = new JwtService(process.env.JWT_SECRET!);
const emailService = new EmailService({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
    },
});
const userRepository = new UserRepository(UserModel);
const userService = new UserService(jwtService, emailService, userRepository);
const userController = new UserController(userService);

router.post('/send-email-verification-email', authenticate, (req, res) =>
    userController.sendEmailVerificationEmail(req, res),
);
router.get('/verify-email/:token', (req, res) => userController.verifyEmail(req, res));
router.get('/me', authenticate, (req, res) => userController.me(req, res));

export default router;
