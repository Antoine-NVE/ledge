import { RedisClientType } from 'redis';
import { CacheStore } from '../../application/ports/cache-store';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';

export class RedisCacheStore implements CacheStore {
    constructor(private client: RedisClientType) {}

    setVerificationEmailCooldown = async (userId: string): Promise<Result<void, Error>> => {
        try {
            await this.client.set(
                `verification_email_cooldown:${userId}`,
                '1', // Placeholder value
                { EX: 5 * 60 }, // 5 minutes
            );

            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    existsVerificationEmailCooldown = async (userId: string): Promise<Result<boolean, Error>> => {
        try {
            const exists = (await this.client.exists(`verification_email_cooldown:${userId}`)) === 1;

            return ok(exists);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
