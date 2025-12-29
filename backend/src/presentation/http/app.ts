import express from 'express';
import cookieParser from 'cookie-parser';
import { createAuthRoutes } from './auth/auth-routes.js';
import { createTransactionRoutes } from './transaction/transaction-routes.js';
import { createUserRoutes } from './user/user-routes.js';
import { createCors } from './middlewares/technical/cors.js';
import { rateLimiter } from './middlewares/technical/rate-limiter.js';
import { createErrorHandler } from './middlewares/technical/error-handler.js';
import { AuthController } from './auth/auth-controller.js';
import { UserController } from './user/user-controller.js';
import { TransactionController } from './transaction/transaction-controller.js';
import { createAuthenticate } from './middlewares/business/auth/authenticate.js';
import { TransactionService } from '../../domain/transaction/transaction-service';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import type { TokenManager } from '../../application/ports/token-manager.js';
import { UserService } from '../../domain/user/user-service';
import type { Logger } from '../../application/ports/logger.js';
import { createAuthorize } from './middlewares/business/auth/authorize.js';
import { CookieManager } from './support/cookie-manager.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import { createDocsRoutes } from './docs/docs-routes.js';

export const createHttpApp = ({
    allowedOrigins,
    transactionService,
    userOrchestrator,
    authOrchestrator,
    tokenManager,
    userService,
    logger,
}: {
    allowedOrigins: string[];
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
    const authController = new AuthController(authOrchestrator, logger, cookieManager);
    const transactionController = new TransactionController(transactionService, logger);
    const userController = new UserController(userOrchestrator, logger);
    const authenticate = createAuthenticate({
        tokenManager,
        userService,
        cookieManager,
    });
    const authorize = createAuthorize({ transactionService });

    // Routes
    app.use('/docs', createDocsRoutes());
    app.use('/auth', createAuthRoutes({ authController }));
    app.use(
        '/transactions',
        createTransactionRoutes({
            transactionController,
            authenticate,
            authorize,
        }),
    );
    app.use('/users', createUserRoutes({ userController, authenticate, allowedOrigins }));
    app.use(() => {
        throw new NotFoundError({ message: 'Route not found' });
    });

    // Error handler
    app.use(createErrorHandler({ logger }));

    return app;
};
