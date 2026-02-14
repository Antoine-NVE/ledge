import { Db, MongoClient } from 'mongodb';
import { fail, ok, type Result } from '../../core/result.js';

type Input = {
    mongoUrl: string;
};

type Output = {
    mongoClient: MongoClient;
    mongoDb: Db;
};

export const connectToMongo = async ({ mongoUrl }: Input): Promise<Result<Output, unknown>> => {
    try {
        const mongoClient = new MongoClient(mongoUrl);
        await mongoClient.connect();
        const mongoDb = mongoClient.db();

        await setupIndexes(mongoDb);

        return ok({ mongoClient, mongoDb });
    } catch (err: unknown) {
        return fail(err);
    }
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
