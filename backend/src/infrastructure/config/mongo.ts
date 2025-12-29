import { Db, MongoClient } from 'mongodb';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';

type Input = {
    mongoUrl: string;
};

type Output = {
    mongoClient: MongoClient;
    mongoDb: Db;
};

export const connectToMongo = async ({ mongoUrl }: Input): Promise<Result<Output, Error>> => {
    try {
        const mongoClient = new MongoClient(mongoUrl);
        await mongoClient.connect();
        const mongoDb = mongoClient.db();

        await setupIndexes(mongoDb);

        return ok({ mongoClient, mongoDb });
    } catch (err: unknown) {
        return fail(ensureError(err));
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
