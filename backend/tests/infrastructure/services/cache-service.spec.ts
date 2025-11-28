import { RedisClientType } from 'redis';
import { CacheService } from '../../../src/infrastructure/adapters/redis-cache-store';
import { ObjectId } from 'mongodb';

describe('CacheService', () => {
    const USER_ID = new ObjectId();

    let clientMock: Partial<RedisClientType>;
    let cacheService: CacheService;

    beforeEach(() => {
        clientMock = {
            set: jest.fn(),
            exists: jest.fn(),
        };

        cacheService = new CacheService(clientMock as RedisClientType);
    });

    describe('setVerificationEmailCooldown', () => {
        it('should call client.set with valid params', async () => {
            await cacheService.setVerificationEmailCooldown(USER_ID);

            expect(clientMock.set).toHaveBeenCalledWith(
                `verification_email_cooldown:${USER_ID.toString()}`,
                '1',
                { EX: 5 * 60 },
            );
        });
    });

    describe('existsVerificationEmailCooldown', () => {
        it('should call client.exists with valid params', async () => {
            await cacheService.existsVerificationEmailCooldown(USER_ID);

            expect(clientMock.exists).toHaveBeenCalledWith(
                `verification_email_cooldown:${USER_ID.toString()}`,
            );
        });

        it('should return true only if client.exists found one entry', async () => {
            (clientMock.exists as jest.Mock)
                .mockResolvedValueOnce(0)
                .mockResolvedValueOnce(1)
                .mockResolvedValueOnce(2);

            expect(
                await cacheService.existsVerificationEmailCooldown(USER_ID),
            ).toBe(false);
            expect(
                await cacheService.existsVerificationEmailCooldown(USER_ID),
            ).toBe(true);
            expect(
                await cacheService.existsVerificationEmailCooldown(USER_ID),
            ).toBe(false);
        });
    });
});
