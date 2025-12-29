import type { Result } from '../../core/types/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';

export interface TokenManager {
    signAccess(payload: { userId: string }): Promise<string>;
    verifyAccess(token: string): Result<{ userId: string }, UnauthorizedError>;

    signVerificationEmail(payload: { userId: string }): Promise<string>;
    verifyVerificationEmail(token: string): Result<{ userId: string }, UnauthorizedError>;
}
