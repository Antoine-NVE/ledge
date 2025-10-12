import { AuthController } from '../controllers/AuthController';
import { TransactionController } from '../controllers/TransactionController';
import { UserController } from '../controllers/UserController';
import { SecurityMiddleware } from '../middlewares/SecurityMiddleware';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenSchema } from '../schemas/RefreshTokenSchema';
import { SecuritySchema } from '../schemas/SecuritySchema';
import { TransactionSchema } from '../schemas/TransactionSchema';
import { UserSchema } from '../schemas/UserSchema';
import { AuthService } from '../services/AuthService';
import { EmailService } from '../services/EmailService';
import { JwtService } from '../services/JwtService';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { TransactionService } from '../services/TransactionService';
import { UserService } from '../services/UserService';
import { db } from './db';
import { env } from './env';

const secret = env.JWT_SECRET;
const allowedOrigins = env.ALLOWED_ORIGINS;
const host = env.SMTP_HOST;
const port = env.SMTP_PORT;
const secure = env.SMTP_SECURE;
const user = env.SMTP_USER;
const pass = env.SMTP_PASS;
const from = env.EMAIL_FROM;

const jwtService = new JwtService(secret);
const emailService = new EmailService(host, port, secure, { user, pass }, from);

const userRepository = new UserRepository(db.collection('users'));
const refreshTokenRepository = new RefreshTokenRepository(db.collection('refreshtokens'));
const transactionRepository = new TransactionRepository(db.collection('transactions'));

const userSchema = new UserSchema();
const refreshTokenSchema = new RefreshTokenSchema();
const transactionSchema = new TransactionSchema();
const securitySchema = new SecuritySchema(allowedOrigins);

const userService = new UserService(
    jwtService,
    emailService,
    userRepository,
    userSchema,
    securitySchema,
);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository, refreshTokenSchema);
const transactionService = new TransactionService(transactionRepository, transactionSchema);

const authService = new AuthService(userService, jwtService, refreshTokenService);

const authController = new AuthController(authService, userSchema);
const userController = new UserController(userService, securitySchema);
const transactionController = new TransactionController(transactionService, transactionSchema);

const securityMiddleware = new SecurityMiddleware(
    userService,
    transactionService,
    jwtService,
    securitySchema,
);

export const container = {
    authController,
    userController,
    transactionController,
    securityMiddleware,
};
