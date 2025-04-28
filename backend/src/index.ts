import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transaction';

dotenv.config();

const app = express();
app.use(express.json());

(async () => {
    try {
        const mongoUri = 'mongodb://ledge-database:27017/ledge';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();

app.use('/transactions', transactionRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
