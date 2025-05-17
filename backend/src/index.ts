import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transaction';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

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

const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://0.0.0.0:${port}`);
});
