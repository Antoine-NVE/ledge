export interface CacheStore {
    setVerificationEmailCooldown: (userId: string) => Promise<void>;
    existsVerificationEmailCooldown: (userId: string) => Promise<boolean>;
}
