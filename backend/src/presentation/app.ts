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
import { Env } from '../infrastructure/config/env-config';
import { Container } from '../infrastructure/config/container-config';

export const createApp = (
    {
        allowedOrigins,
        nodeEnv,
    }: {
        allowedOrigins: Env['ALLOWED_ORIGINS'];
        nodeEnv: Env['NODE_ENV'];
    },
    container: Container,
    logger: Logger,
) => {
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
    app.use('/auth', createAuthRoutes(container));
    app.use('/transactions', createTransactionRoutes(container));
    app.use('/users', createUserRoutes(container, allowedOrigins));
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandler(nodeEnv, logger));

    return app;
};
