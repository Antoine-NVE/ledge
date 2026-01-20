import { createClient, type RedisClientType } from 'redis';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type Input = {
    redisUrl: string;
};

type Output = {
    redisClient: RedisClientType;
};

export const connectToRedis = async ({ redisUrl }: Input): Promise<Result<Output, unknown>> => {
    try {
        const redisClient: RedisClientType = createClient({ url: redisUrl });

        await redisClient.connect();

        return ok({ redisClient });
    } catch (err: unknown) {
        return fail(err);
    }
};
