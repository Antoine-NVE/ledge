import express from 'express';

import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { env } from '../config/env';
import { db } from '../config/db';
import { UserService } from '../services/UserService';
import { EmailService } from '../services/EmailService';
import { RefreshTokenService } from '../services/RefreshTokenService';

const router = express.Router();

const userRepository = new UserRepository(db.collection('users'));
const secret = env.JWT_SECRET;
const jwtService = new JwtService(secret);
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
const refreshTokenRepository = new RefreshTokenRepository(db.collection('refreshtokens'));
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const authService = new AuthService(userService, jwtService, refreshTokenService);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
