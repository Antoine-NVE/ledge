import express from 'express';
import { container } from '../../infrastructure/config/container-config';
import { validate } from '../shared/middlewares/validate/validate-middleware';
import {
    sendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';
import { authenticate } from '../shared/middlewares/authenticate/authenticate-middleware';

const router = express.Router();

const { jwtService, userService } = container;
const { sendVerificationEmail, verifyEmail, me } = container.userController;

router.post(
    '/send-verification-email',
    authenticate(jwtService, userService),
    validate(sendVerificationEmailBodySchema),
    sendVerificationEmail,
);
router.post('/verify-email', validate(verifyEmailBodySchema), verifyEmail);
router.get('/me', authenticate(jwtService, userService), me);

export default router;
