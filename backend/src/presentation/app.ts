import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { NotFoundError } from '../infrastructure/errors/not-found-error';
import { Container } from '../infrastructure/types/container-type';
import { Env } from '../infrastructure/types/env-type';
import { Logger } from 'pino';
import { createAuthRoutes } from './auth/auth-routes';
import { createTransactionRoutes } from './transaction/transaction-routes';
import { createUserRoutes } from './user/user-routes';
import { createCors } from './middlewares/technical/cors';
import { rateLimiter } from './middlewares/technical/rate-limit';
import { swagger } from './middlewares/technical/swagger';
import { createErrorHandler } from './middlewares/technical/error-handler';

export const createApp = (env: Env, container: Container, logger: Logger) => {
    const app = express();

    // Security
    app.use(createCors(env.ALLOWED_ORIGINS));
    app.use(rateLimiter);

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    if (env.NODE_ENV === 'development') {
        app.use('/docs', swaggerUi.serve, swagger);
    }
    app.use('/auth', createAuthRoutes(container));
    app.use('/transactions', createTransactionRoutes(container));
    app.use('/users', createUserRoutes(container, env.ALLOWED_ORIGINS));
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandler(env.NODE_ENV, logger));

    return app;
};
