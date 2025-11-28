import { ObjectId } from 'mongodb';

export interface CacheStore {
    setVerificationEmailCooldown: (userId: ObjectId) => Promise<void>;
    existsVerificationEmailCooldown: (userId: ObjectId) => Promise<boolean>;
}
