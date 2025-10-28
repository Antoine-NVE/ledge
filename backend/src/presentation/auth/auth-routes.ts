import express from 'express';
import { container } from '../../infrastructure/config/container-config';
import { validateBody } from '../shared/middlewares/validate-body/validate-body-middleware';
import { loginBodySchema, registerBodySchema } from './auth-schemas';

const router = express.Router();

const { register, login, refresh, logout } = container.authController;

router.post('/register', validateBody(registerBodySchema), register);
router.post('/login', validateBody(loginBodySchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
