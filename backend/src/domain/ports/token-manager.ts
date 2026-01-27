import type { Result } from '../../core/types/result.js';

export interface TokenManager {
    signAccess(payload: { userId: string }): string;
    verifyAccess(accessToken: string): Result<{ userId: string }, { type: 'INVALID_TOKEN' }>;

    signEmailVerification(payload: { userId: string }): string;
    verifyEmailVerification(emailVerificationToken: string): Result<{ userId: string }, { type: 'INVALID_TOKEN' }>;
}
