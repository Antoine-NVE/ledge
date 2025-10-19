import { MongoClient } from 'mongodb';
import { env } from './env';

const client = new MongoClient(`mongodb://${env.DATABASE_SERVICE}:27017`);
(async () => {
    await client.connect();

    const db = client.db('ledge');

    await db.collection('users').createIndex({ email: 1 }, { unique: true });
})();

export const db = client.db('ledge');
