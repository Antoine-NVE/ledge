import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transaction';
import userRoutes from './routes/user';
import {
    formatMongooseValidationErrors,
    formatZodValidationErrors,
} from './utils/error';
import { UnauthorizedError } from './errors/UnauthorizedError';
import { HttpError } from './errors/HttpError';
import { env } from './config/env';
import * as yup from 'yup';
import z from 'zod';

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
// app.use('/users', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            message: 'Validation error',
            data: null,
            errors: formatMongooseValidationErrors(err),
        });
        return;
    }

    if (err instanceof z.ZodError) {
        res.status(400).json({
            message: 'Validation error',
            data: null,
            errors: formatZodValidationErrors(err),
        });
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            message: err.message,
            data: null,
            errors: null,
        });
        return;
    }

    console.error(err);
    if (env.NODE_ENV === 'development') {
        res.status(500).json({
            message: err.message,
            data: null,
            errors: null,
        });
        return;
    }
    res.status(500).json({
        message: 'Internal server error',
        data: null,
        errors: null,
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://0.0.0.0:${port}`);
});
