import { Db, MongoClient } from 'mongodb';

export const connectToMongo = async ({ url }: { url: string }) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db();

    await setupIndexes(db);

    return { client, db };
};

const setupIndexes = async (db: Db) => {
    // Users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // Refresh tokens
    await db
        .collection('refreshtokens')
        .createIndex({ token: 1 }, { unique: true });
    await db
        .collection('refreshtokens')
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Transactions
    await db.collection('transactions').createIndex({ userId: 1 });
};
