import { MongoClient } from 'mongodb';

const client = new MongoClient(`mongodb://database:27017`);
(async () => {
    await client.connect();

    const db = client.db('ledge');

    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    await db
        .collection('refreshtokens')
        .createIndex({ token: 1 }, { unique: true });
    await db
        .collection('refreshtokens')
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    await db.collection('transactions').createIndex({ userId: 1 });
})();

export const db = client.db('ledge');
