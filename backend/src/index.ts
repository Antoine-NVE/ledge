import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transaction';
import userRoutes from './routes/user';
import { HttpError } from './errors/HttpError';
import { env } from './config/env';
import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from './errors/TooManyRequestsError';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: env.ALLOWED_ORIGINS,
        credentials: true,
    }),
);

app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 100,
        handler: () => {
            throw new TooManyRequestsError();
        },
    }),
);

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);
app.all(/.*/, () => {
    throw new NotFoundError('Route not found');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    const isHttpError = err instanceof HttpError;
    const status = isHttpError ? err.status : 500;

    if (env.NODE_ENV === 'development') {
        res.status(status).json({
            message: err.message,
            errors: isHttpError ? err.errors : undefined,
            meta: isHttpError ? err.meta : undefined,
        });
        return;
    }

    if (isHttpError && status < 500) {
        res.status(status).json({
            message: err.message,
            errors: err.errors,
            meta: err.meta,
        });
        return;
    }

    console.error(err);
    res.status(status).json({
        message: 'Internal server error',
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://0.0.0.0:${port}`);
});
