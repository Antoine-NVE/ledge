import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transaction';
import userRoutes from './routes/user';
import { formatMongooseValidationErrors } from './utils/error';
import { UnauthorizedError } from './errors/UnauthorizedError';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

(async () => {
    try {
        const mongoUri = `mongodb://${process.env.DATABASE_SERVICE}:27017/ledge`;
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);

app.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            message: 'Validation Error',
            data: null,
            errors: formatMongooseValidationErrors(err),
        });
        return;
    }

    if (err instanceof UnauthorizedError) {
        res.status(401).json({
            message: err.message,
            data: null,
            errors: null,
        });
        return;
    }

    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://0.0.0.0:${port}`);
});
