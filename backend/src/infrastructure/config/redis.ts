import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export const connectToRedis = async () => {
    client = createClient({ url: 'redis://cache:6379' });
    await client.connect();
    return client;
};
