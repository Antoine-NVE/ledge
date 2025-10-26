import { AccessMiddleware } from '../../presentation/shared/middlewares/access/access-middleware';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { UserRepository } from '../../domain/user/user-repository';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { TransactionService } from '../../domain/transaction/transaction-service';
import { UserService } from '../../domain/user/user-service';
import { db } from './db-config';
import { env } from './env-config';
import { AuthController } from '../../presentation/auth/auth-controller';
import { UserController } from '../../presentation/user/user-controller';
import { TransactionController } from '../../presentation/transaction/transaction-controller';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import { TransactionOrchestrator } from '../../application/transaction/transaction-orchestrator';
import { RefreshTokenService } from '../../domain/refresh-token/refresh-token-service';
import { JwtService } from '../services/jwt-service';
import { EmailService } from '../services/email-service';
import { PasswordService } from '../services/password-service';
import { TokenService } from '../services/token-service';

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

const userService = new UserService(userRepository);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const transactionService = new TransactionService(transactionRepository);

const authOrchestrator = new AuthOrchestrator(
    userService,
    jwtService,
    refreshTokenService,
    passwordService,
    tokenService,
);
const userOrchestrator = new UserOrchestrator(
    jwtService,
    emailService,
    userService,
);
const transactionOrchestrator = new TransactionOrchestrator(transactionService);

const authController = new AuthController(authOrchestrator);
const userController = new UserController(userOrchestrator);
const transactionController = new TransactionController(
    transactionOrchestrator,
);

const accessMiddleware = new AccessMiddleware(
    userService,
    transactionService,
    jwtService,
);

export const container = {
    authController,
    userController,
    transactionController,
    accessMiddleware,
};
