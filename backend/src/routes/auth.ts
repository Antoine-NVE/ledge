import express from 'express';

import { login, logout, refresh, register } from '../controllers/AuthController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
