import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { UserRepository } from '../../domain/user/user-repository';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { TransactionService } from '../../domain/transaction/transaction-service';
import { UserService } from '../../domain/user/user-service';
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
import { CacheService } from '../services/cache-service';
import { Container } from '../types/container-type';
import { Db } from 'mongodb';
import { Env } from '../types/env-type';
import { RedisClientType } from 'redis';
import { createAuthenticateMiddleware } from '../../presentation/shared/middlewares/authenticate/authenticate-middleware';
import { createAuthorizeMiddleware } from '../../presentation/shared/middlewares/authorize/authorize-middleware';

export const buildContainer = (
    env: Env,
    cacheClient: RedisClientType,
    db: Db,
): Container => {
    const secret = env.JWT_SECRET;
    const host = env.SMTP_HOST;
    const port = env.SMTP_PORT;
    const secure = env.SMTP_SECURE;
    const user = env.SMTP_USER;
    const pass = env.SMTP_PASS;

    const jwtService = new JwtService(secret);
    const emailService = new EmailService({
        host,
        port,
        secure,
        auth: { user, pass },
    });
    const passwordService = new PasswordService();
    const tokenService = new TokenService();
    const cacheService = new CacheService(cacheClient);

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
        cacheService,
        env,
    );
    const transactionOrchestrator = new TransactionOrchestrator(
        transactionService,
    );

    const authController = new AuthController(authOrchestrator);
    const userController = new UserController(userOrchestrator);
    const transactionController = new TransactionController(
        transactionOrchestrator,
    );

    const authenticate = createAuthenticateMiddleware(jwtService, userService);
    const authorize = createAuthorizeMiddleware(transactionService);

    return {
        authController,
        userController,
        transactionController,
        authenticate,
        authorize,
    };
};
