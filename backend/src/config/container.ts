import { AuthController } from '../controllers/AuthController';
import { TransactionController } from '../controllers/TransactionController';
import { UserController } from '../controllers/UserController';
import { SecurityMiddleware } from '../middlewares/SecurityMiddleware';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { EmailService } from '../services/EmailService';
import { JwtService } from '../services/JwtService';
import { PasswordService } from '../services/PasswordService';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { TransactionService } from '../services/TransactionService';
import { UserService } from '../services/UserService';
import { db } from './db';
import { env } from './env';

const secret = env.JWT_SECRET;
const host = env.SMTP_HOST;
const port = env.SMTP_PORT;
const secure = env.SMTP_SECURE;
const user = env.SMTP_USER;
const pass = env.SMTP_PASS;
const from = env.EMAIL_FROM;

const jwtService = new JwtService(secret);
const emailService = new EmailService(host, port, secure, { user, pass }, from);
const passwordService = new PasswordService();

const userRepository = new UserRepository(db.collection('users'));
const refreshTokenRepository = new RefreshTokenRepository(
    db.collection('refreshtokens'),
);
const transactionRepository = new TransactionRepository(
    db.collection('transactions'),
);

const userService = new UserService(jwtService, emailService, userRepository);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const transactionService = new TransactionService(transactionRepository);

const authService = new AuthService(
    userService,
    jwtService,
    refreshTokenService,
    passwordService,
);

const authController = new AuthController(authService, userService);
const userController = new UserController(userService);
const transactionController = new TransactionController(transactionService);

const securityMiddleware = new SecurityMiddleware(
    userService,
    transactionService,
    jwtService,
);

export const container = {
    authController,
    userController,
    transactionController,
    securityMiddleware,
};
