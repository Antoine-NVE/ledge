import express from 'express';
import { container } from '../../infrastructure/config/container';

const router = express.Router();

const { register, login, refresh, logout } = container.authController;

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
