import express from 'express';

import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { JwtService } from '../services/JwtService';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import RefreshTokenModel from '../models/RefreshToken';
import UserModel from '../models/User';
import { env } from '../config/env';

const router = express.Router();

const userModel = UserModel;
const userRepository = new UserRepository(userModel);
const secret = env.JWT_SECRET!;
const jwtService = new JwtService(secret);
const refreshTokenModel = RefreshTokenModel;
const refreshTokenRepository = new RefreshTokenRepository(refreshTokenModel);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const authService = new AuthService(userRepository, jwtService, refreshTokenService);
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
