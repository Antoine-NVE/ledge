import { Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToMongo = async () => {
    client = new MongoClient('mongodb://database:27017');
    await client.connect();
    db = client.db('ledge');

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
