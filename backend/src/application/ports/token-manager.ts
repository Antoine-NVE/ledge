import { ObjectId } from 'mongodb';

export interface TokenManager {
    signAccess(userId: ObjectId): string;
    verifyAccess(token: string): ObjectId;

    signVerificationEmail(userId: ObjectId): string;
    verifyVerificationEmail(token: string): ObjectId;
}
