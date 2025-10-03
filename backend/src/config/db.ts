import { MongoClient } from 'mongodb';
import { env } from './env';

const client = new MongoClient(`mongodb://${env.DATABASE_SERVICE}:27017`);
(async () => {
    await client.connect();
})();

export const db = client.db('ledge');
