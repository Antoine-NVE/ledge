import { Db, MongoClient } from 'mongodb';

export const connectToMongo = async ({
    user,
    password,
}: {
    user: string;
    password: string;
}) => {
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);

    const client = new MongoClient(
        `mongodb://${encodedUser}:${encodedPassword}@database:27017`,
    );
    await client.connect();
    const db = client.db('ledge');

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
