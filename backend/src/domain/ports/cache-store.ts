export interface CacheStore {
    setEmailVerificationCooldown: (userId: string) => Promise<void>;
    hasEmailVerificationCooldown: (userId: string) => Promise<boolean>;
}
