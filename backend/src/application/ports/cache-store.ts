import { Result } from '../../core/types/result';

export interface CacheStore {
    setVerificationEmailCooldown: (userId: string) => Promise<Result<void, Error>>;
    existsVerificationEmailCooldown: (userId: string) => Promise<Result<boolean, Error>>;
}
