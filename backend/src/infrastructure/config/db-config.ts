import { Db, MongoClient } from 'mongodb';

export const client = new MongoClient(`mongodb://database:27017`);
export const db: Db = client.db('ledge');

(async () => {
    try {
        // Only here to catch connection errors
        await client.connect();

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
