import express from 'express';
import { createCorsMiddleware } from './middlewares/cors-middleware';
import { rateLimitMiddleware } from './middlewares/rate-limit-middleware';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerMiddleware } from './middlewares/swagger-middleware';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { createErrorHandlerMiddleware } from './middlewares/error-handler-middleware';
import { authRoutes } from '../auth/auth-routes';
import { transactionRoutes } from '../transaction/transaction-routes';
import { userRoutes } from '../user/user-routes';
import { Container } from '../../infrastructure/types/container-type';
import { Env } from '../../infrastructure/types/env-type';
import { Logger } from 'pino';

export const createHttpServer = (
    env: Env,
    container: Container,
    logger: Logger,
) => {
    const app = express();

    // Security
    app.use(createCorsMiddleware(env));
    app.use(rateLimitMiddleware);

    // Parsing
    app.use(express.json());
    app.use(cookieParser());

    // Routes
    if (env.NODE_ENV === 'development') {
        app.use('/docs', swaggerUi.serve, swaggerMiddleware);
    }
    app.use('/auth', authRoutes(container));
    app.use('/transactions', transactionRoutes(container));
    app.use('/users', userRoutes(container, env));
    app.all(/.*/, () => {
        throw new NotFoundError('Route not found');
    });

    // Error handler
    app.use(createErrorHandlerMiddleware(env, logger));

    return app;
};
