import type { Result } from '../../core/types/result.js';

export type VerifyTokenError = { type: 'INACTIVE_TOKEN' } | { type: 'INVALID_TOKEN' } | { type: 'EXPIRED_TOKEN' };

export type VerifyTokenResult = Result<{ userId: string }, VerifyTokenError>;

export interface TokenManager {
    signAccess(payload: { userId: string }): string;
    verifyAccess(accessToken: string): VerifyTokenResult;

    signEmailVerification(payload: { userId: string }): string;
    verifyEmailVerification(emailVerificationToken: string): VerifyTokenResult;
}
