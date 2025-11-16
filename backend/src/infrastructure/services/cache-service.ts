import { RedisClientType } from 'redis';
import { ObjectId } from 'mongodb';

export class CacheService {
    constructor(private client: RedisClientType) {}

    setVerificationEmailCooldown = async (userId: ObjectId) => {
        await this.client.set(
            `verification_email_cooldown:${userId.toString()}`,
            '1',
            { EX: 5 * 60 }, // 5 minutes
        );
    };

    existsVerificationEmailCooldown = async (userId: ObjectId) => {
        return (
            (await this.client.exists(
                `verification_email_cooldown:${userId.toString()}`,
            )) === 1
        );
    };
}
