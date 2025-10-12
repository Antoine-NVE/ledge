import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transaction';
import userRoutes from './routes/user';
import { UnauthorizedError } from './errors/UnauthorizedError';
import { HttpError } from './errors/HttpError';
import { env } from './config/env';
import z from 'zod';
import { FormatUtils } from './utils/FormatUtils';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: env.ALLOWED_ORIGINS,
        credentials: true,
    }),
);

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof HttpError && err.statusCode !== 500) {
        res.status(err.statusCode).json({
            message: err.message,
            errors: err.errors,
            action: err.action,
        });
        return;
    }

    console.error(err);
    if (env.NODE_ENV === 'development') {
        res.status(500).json({
            message: err.message,
            errors: (err instanceof HttpError && err.errors) ?? undefined,
        });
        return;
    }
    res.status(500).json({
        message: 'Internal server error',
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://0.0.0.0:${port}`);
});
