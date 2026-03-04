import { createClient, type RedisClientType } from 'redis';
import type { Env } from './env.js';

type Input = {
    redisUrl: Env['redisUrl'];
};

type Output = {
    redisClient: RedisClientType;
};

export const connectToRedis = async ({ redisUrl }: Input): Promise<Output> => {
    const redisClient: RedisClientType = createClient({ url: redisUrl });

    await redisClient.connect();

    return { redisClient };
};
