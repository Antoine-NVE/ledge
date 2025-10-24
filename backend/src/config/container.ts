import { AuthController } from '../controllers/auth-controller';
import { TransactionController } from '../controllers/transaction-controller';
import { UserController } from '../controllers/user-controller';
import { SecurityMiddleware } from '../middlewares/security-middleware';
import { RefreshTokenRepository } from '../entities/refresh-token/refresh-token-repository';
import { TransactionRepository } from '../entities/transaction/transaction-repository';
import { UserRepository } from '../entities/user/user-repository';
import { AuthService } from '../services/auth-service';
import { EmailService } from '../services/email-service';
import { JwtService } from '../services/jwt-service';
import { PasswordService } from '../services/password-service';
import { RefreshTokenService } from '../services/refresh-token-service';
import { TokenService } from '../services/token-service';
import { TransactionService } from '../services/transaction-service';
import { UserService } from '../services/user-service';
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
const tokenService = new TokenService();

const userRepository = new UserRepository(db.collection('users'));
const refreshTokenRepository = new RefreshTokenRepository(
    db.collection('refreshtokens'),
);
const transactionRepository = new TransactionRepository(
    db.collection('transactions'),
);

const userService = new UserService(jwtService, emailService, userRepository);
const refreshTokenService = new RefreshTokenService(
    refreshTokenRepository,
    tokenService,
);
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
