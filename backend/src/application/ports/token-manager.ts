import type { Result } from '../../core/types/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';

export interface TokenManager {
    signAccess(payload: { userId: string }): Promise<string>;
    verifyAccess(accessToken: string): Result<{ userId: string }, UnauthorizedError>;

    signEmailVerification(payload: { userId: string }): Promise<string>;
    verifyEmailVerification(emailVerificationToken: string): Result<{ userId: string }, UnauthorizedError>;
}
