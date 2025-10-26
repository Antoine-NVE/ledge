import { MongoClient } from 'mongodb';

const client = new MongoClient(`mongodb://database:27017`);
(async () => {
    await client.connect();

    const db = client.db('ledge');

    await db.collection('users').createIndex({ email: 1 }, { unique: true });
})();

export const db = client.db('ledge');
