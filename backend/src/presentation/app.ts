import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { NotFoundError } from '../infrastructure/errors/not-found-error';
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
import { Authenticate } from './middlewares/business/auth/authenticate';
import { Authorize } from './middlewares/business/auth/authorize';
import { Logger } from '../application/ports/logger';

export const createApp = ({
    allowedOrigins,
    nodeEnv,
    authController,
    userController,
    transactionController,
    authenticate,
    authorize,
    logger,
}: {
    allowedOrigins: string[];
    nodeEnv: 'development' | 'production';
    authController: AuthController;
    userController: UserController;
    transactionController: TransactionController;
    authenticate: Authenticate;
    authorize: Authorize;
    logger: Logger;
}) => {
    const app = express();

    // Security
    app.use(createCors(allowedOrigins));
    app.use(rateLimiter);

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    if (nodeEnv === 'development') {
        app.use('/docs', swaggerUi.serve, swagger);
    }
    app.use('/auth', createAuthRoutes(authController));
    app.use(
        '/transactions',
        createTransactionRoutes(transactionController, authenticate, authorize),
    );
    app.use(
        '/users',
        createUserRoutes(userController, authenticate, allowedOrigins),
    );
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandler(nodeEnv, logger));

    return app;
};
