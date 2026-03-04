import { Db, MongoClient } from 'mongodb';
import type { Env } from './env.js';

type Input = {
    mongoUrl: Env['mongoUrl'];
};

type Output = {
    mongoClient: MongoClient;
    mongoDb: Db;
};

export const connectToMongo = async ({ mongoUrl }: Input): Promise<Output> => {
    const mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    const mongoDb = mongoClient.db();

    await setupIndexes(mongoDb);

    return { mongoClient, mongoDb };
};

const setupIndexes = async (db: Db) => {
    // Users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // Refresh tokens
    await db.collection('refreshtokens').createIndex({ value: 1 }, { unique: true });
    await db.collection('refreshtokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Transactions
    await db.collection('transactions').createIndex({ userId: 1 });
};
