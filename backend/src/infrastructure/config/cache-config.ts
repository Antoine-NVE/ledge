import { createClient, RedisClientType } from 'redis';

const REDIS_URL = 'redis://cache:6379';

let client: RedisClientType | null = null;

export const connectToCache = async () => {
    if (client) {
        throw new Error('connectToCache() called multiple times — forbidden.');
    }

    client = createClient({ url: REDIS_URL });
    await client.connect();

    return client;
};
