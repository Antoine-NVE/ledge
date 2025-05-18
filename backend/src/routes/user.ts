import express from 'express';

import { me } from '../controllers/user';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.get('/me', authenticate, me);

export default router;
