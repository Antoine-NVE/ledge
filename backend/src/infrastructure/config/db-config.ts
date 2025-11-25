import { Db, MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://database:27017';
const DB_NAME = 'ledge';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToDb = async () => {
    if (client || db) {
        throw new Error('connectToDb() called multiple times — forbidden.');
    }

    client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);

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
