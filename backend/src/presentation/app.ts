import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { NotFoundError } from '../infrastructure/errors/not-found-error';
import { Logger } from 'pino';
import { createAuthRoutes } from './auth/auth-routes';
import { createTransactionRoutes } from './transaction/transaction-routes';
import { createUserRoutes } from './user/user-routes';
import { createCors } from './middlewares/technical/cors';
import { rateLimiter } from './middlewares/technical/rate-limit';
import { swagger } from './middlewares/technical/swagger';
import { createErrorHandler } from './middlewares/technical/error-handler';
import { Container } from '../infrastructure/config/container';

export const createApp = (
    options: {
        allowedOrigins: string[];
        nodeEnv: 'development' | 'production';
    },
    container: Container,
    logger: Logger,
) => {
    const app = express();

    // Security
    app.use(createCors(options.allowedOrigins));
    app.use(rateLimiter);

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    if (options.nodeEnv === 'development') {
        app.use('/docs', swaggerUi.serve, swagger);
    }
    app.use('/auth', createAuthRoutes(container));
    app.use('/transactions', createTransactionRoutes(container));
    app.use('/users', createUserRoutes(container, options.allowedOrigins));
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandler(options.nodeEnv, logger));

    return app;
};
