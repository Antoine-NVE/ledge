import type { Result } from '../../core/types/result.js';

export interface CacheStore {
    setEmailVerificationCooldown: (userId: string) => Promise<Result<void, Error>>;
    hasEmailVerificationCooldown: (userId: string) => Promise<Result<boolean, Error>>;
}
