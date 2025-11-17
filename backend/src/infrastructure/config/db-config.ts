import { MongoClient } from 'mongodb';

export const client = new MongoClient(`mongodb://database:27017`);

(async () => {
    try {
        await client.connect();

        const db = client.db('ledge');

        await db
            .collection('users')
            .createIndex({ email: 1 }, { unique: true });

        await db
            .collection('refreshtokens')
            .createIndex({ token: 1 }, { unique: true });
        await db
            .collection('refreshtokens')
            .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

        await db.collection('transactions').createIndex({ userId: 1 });

        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
})();

export const db = client.db('ledge');
