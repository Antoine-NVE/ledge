import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import TransactionModel from './models/Transaction';

const app = express();

app.get('/', async (req: Request, res: Response) => {
    const transaction = new TransactionModel({
        month: '2025-04',
        income: true,
        fixed: true,
        name: 'Salary',
        value: 5000,
    });

    try {
        await transaction.save();
        console.log('Transaction saved:', transaction);
    } catch (err) {
        console.error('Error saving transaction:', err);
    }

    res.send('Hello World from Backend!');
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://ledge-database:27017/ledge');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();

const port = process.env.EXPRESS_PORT || 3000;
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
