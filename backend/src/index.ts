import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './presentation/auth/auth-routes';
import transactionRoutes from './presentation/transaction/transaction-routes';
import userRoutes from './presentation/user/user-routes';
import { HttpError } from './infrastructure/errors/http-error';
import { env } from './infrastructure/config/env';
import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from './infrastructure/errors/too-many-requests-error';
import { NotFoundError } from './infrastructure/errors/not-found-error';

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
    console.log(`Backend listening on port ${port}`);
});
