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
import { container } from '../config/container';

const router = express.Router();

const { register, login, refresh, logout } = container.authController;

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
