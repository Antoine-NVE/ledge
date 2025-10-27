import express from 'express';
import { container } from '../../infrastructure/config/container-config';
import { validate } from '../shared/middlewares/validate/validate-middleware';
import { loginBodySchema, registerBodySchema } from './auth-schemas';

const router = express.Router();

const { register, login, refresh, logout } = container.authController;

router.post('/register', validate(registerBodySchema), register);
router.post('/login', validate(loginBodySchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
