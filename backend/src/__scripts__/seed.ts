import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TransactionDocument } from '../models/Transaction';
import { generateTransactions } from './transaction';
import { UserDocument } from '../models/User';
import { generateUsers } from './user';
import { env } from '../config/env';

export const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const pickSome = <T>(array: T[]): T[] => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * (array.length + 1));
    return shuffled.slice(0, count);
};

(async () => {
    console.log(env);

    try {
        const mongoUri = `mongodb://${env.DATABASE_SERVICE}:27017/ledge`;
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const users: UserDocument[] = await generateUsers();
        const transactions: TransactionDocument[] = await generateTransactions(users);

        console.log(`Number of users created: ${users.length}`);
        console.log(`Number of transactions created: ${transactions.length}`);

        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();
