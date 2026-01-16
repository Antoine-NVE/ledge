import type { RedisClientType } from 'redis';
import type { CacheStore } from '../../application/ports/cache-store.js';

export class RedisCacheStore implements CacheStore {
    constructor(private client: RedisClientType) {}

    setEmailVerificationCooldown = async (userId: string): Promise<void> => {
        await this.client.set(
            `verification_email_cooldown:${userId}`,
            '1', // Placeholder value
            { EX: 5 * 60 }, // 5 minutes
        );
    };

    hasEmailVerificationCooldown = async (userId: string): Promise<boolean> => {
        return (await this.client.exists(`verification_email_cooldown:${userId}`)) === 1;
    };
}
