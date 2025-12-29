import type { Result } from '../../core/types/result.js';

export interface CacheStore {
    setVerificationEmailCooldown: (userId: string) => Promise<Result<void, Error>>;
    existsVerificationEmailCooldown: (userId: string) => Promise<Result<boolean, Error>>;
}
