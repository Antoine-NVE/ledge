import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { createAuthRoutes } from './auth/auth-routes';
import { createTransactionRoutes } from './transaction/transaction-routes';
import { createUserRoutes } from './user/user-routes';
import { createCors } from './middlewares/technical/cors';
import { rateLimiter } from './middlewares/technical/rate-limit';
import { swagger } from './middlewares/technical/swagger';
import { createErrorHandler } from './middlewares/technical/error-handler';
import { AuthController } from './auth/auth-controller';
import { UserController } from './user/user-controller';
import { TransactionController } from './transaction/transaction-controller';
import { createAuthenticate } from './middlewares/business/auth/authenticate';
import { TransactionService } from '../../domain/transaction/transaction-service';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { TokenManager } from '../../application/ports/token-manager';
import { UserService } from '../../domain/user/user-service';
import { Logger } from '../../application/ports/logger';
import { createAuthorize } from './middlewares/business/auth/authorize';
import { CookieManager } from './support/cookie-manager';
import { NotFoundError } from '../../core/errors/not-found-error';

export const createHttpApp = ({
    allowedOrigins,
    nodeEnv,
    transactionService,
    userOrchestrator,
    authOrchestrator,
    tokenManager,
    userService,
    logger,
}: {
    allowedOrigins: string[];
    nodeEnv: 'development' | 'production';
    transactionService: TransactionService;
    userOrchestrator: UserOrchestrator;
    authOrchestrator: AuthOrchestrator;
    tokenManager: TokenManager;
    userService: UserService;
    logger: Logger;
}) => {
    const app = express();

    // Security
    app.use(createCors({ allowedOrigins }));
    app.use(rateLimiter);

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Dependencies
    const cookieManager = new CookieManager();
    const authController = new AuthController(
        authOrchestrator,
        logger,
        cookieManager,
    );
    const transactionController = new TransactionController(
        transactionService,
        logger,
    );
    const userController = new UserController(userOrchestrator, logger);
    const authenticate = createAuthenticate({
        tokenManager,
        userService,
        cookieManager,
    });
    const authorize = createAuthorize({ transactionService });

    // Routes
    if (nodeEnv === 'development') {
        app.use('/docs', swaggerUi.serve, swagger);
    }
    app.use('/auth', createAuthRoutes({ authController }));
    app.use(
        '/transactions',
        createTransactionRoutes({
            transactionController,
            authenticate,
            authorize,
        }),
    );
    app.use(
        '/users',
        createUserRoutes({ userController, authenticate, allowedOrigins }),
    );
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandler({ logger }));

    return app;
};
