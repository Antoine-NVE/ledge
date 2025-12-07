import { createClient, RedisClientType } from 'redis';

export const connectToRedis = async () => {
    const client: RedisClientType = createClient({ url: 'redis://cache:6379' });
    await client.connect();
    return client;
};
