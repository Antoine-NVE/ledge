import express from 'express';
import { container } from '../../infrastructure/config/container-config';
import { validate } from '../shared/middlewares/validate/validate-middleware';
import {
    sendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';

const router = express.Router();

const { authenticate } = container.accessMiddleware;
const { sendVerificationEmail, verifyEmail, me } = container.userController;

router.post(
    '/send-verification-email',
    authenticate,
    validate(sendVerificationEmailBodySchema),
    sendVerificationEmail,
);
router.post('/verify-email', validate(verifyEmailBodySchema), verifyEmail);
router.get('/me', authenticate, me);

export default router;
