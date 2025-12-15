import { createClient, RedisClientType } from 'redis';

export const connectToRedis = async ({ url }: { url: string }) => {
    const client: RedisClientType = createClient({ url });
    await client.connect();
    return client;
};
