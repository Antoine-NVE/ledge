import express from 'express';

import { getUser } from '../controllers/user';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.get('/me', authenticate, getUser);

export default router;
