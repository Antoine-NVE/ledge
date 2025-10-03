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

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
