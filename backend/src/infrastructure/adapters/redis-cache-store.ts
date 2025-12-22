import { RedisClientType } from 'redis';
import { CacheStore } from '../../application/ports/cache-store';

export class RedisCacheStore implements CacheStore {
    constructor(private client: RedisClientType) {}

    setVerificationEmailCooldown = async (userId: string) => {
        await this.client.set(
            `verification_email_cooldown:${userId}`,
            '1', // Placeholder value
            { EX: 5 * 60 }, // 5 minutes
        );
    };

    existsVerificationEmailCooldown = async (userId: string) => {
        return (await this.client.exists(`verification_email_cooldown:${userId}`)) === 1;
    };
}
