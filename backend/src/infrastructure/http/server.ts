import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../../presentation/auth/auth-routes';
import transactionRoutes from '../../presentation/transaction/transaction-routes';
import userRoutes from '../../presentation/user/user-routes';
import { NotFoundError } from '../errors/not-found-error';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from './middlewares/cors-middleware';
import { rateLimitMiddleware } from './middlewares/rate-limit-middleware';
import { swaggerMiddleware } from './middlewares/swagger-middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler-middleware';

const app = express();

// Security
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

// Parsing
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerMiddleware);
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);
app.all(/.*/, () => {
    throw new NotFoundError('Route not found');
});

// Error handler
app.use(errorHandlerMiddleware);

// Server
const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
