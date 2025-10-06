import express from 'express';

import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { env } from '../config/env';
import { db } from '../config/db';

const router = express.Router();

const userRepository = new UserRepository(db.collection('users'));
const secret = env.JWT_SECRET;
const jwtService = new JwtService(secret);
const refreshTokenRepository = new RefreshTokenRepository(db.collection('refreshtokens'));
const authService = new AuthService(userRepository, jwtService, refreshTokenRepository);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
