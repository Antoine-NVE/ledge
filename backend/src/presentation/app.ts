import express from 'express';
import { createCorsMiddleware } from './middlewares/technical/cors';
import { rateLimitMiddleware } from './middlewares/technical/rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerMiddleware } from './middlewares/technical/swagger';
import { NotFoundError } from '../infrastructure/errors/not-found-error';
import { createErrorHandlerMiddleware } from './middlewares/technical/error-handler';
import { Container } from '../infrastructure/types/container-type';
import { Env } from '../infrastructure/types/env-type';
import { Logger } from 'pino';
import { createAuthRoutes } from './auth/auth-routes';
import { createTransactionRoutes } from './transaction/transaction-routes';
import { createUserRoutes } from './user/user-routes';

export const createApp = (env: Env, container: Container, logger: Logger) => {
    const app = express();

    // Security
    app.use(createCorsMiddleware(env.ALLOWED_ORIGINS));
    app.use(rateLimitMiddleware);

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    if (env.NODE_ENV === 'development') {
        app.use('/docs', swaggerUi.serve, swaggerMiddleware);
    }
    app.use('/auth', createAuthRoutes(container));
    app.use('/transactions', createTransactionRoutes(container));
    app.use('/users', createUserRoutes(container, env.ALLOWED_ORIGINS));
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandlerMiddleware(env.NODE_ENV, logger));

    return app;
};
