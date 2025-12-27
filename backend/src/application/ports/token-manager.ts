import { Result } from '../../core/types/result';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

export interface TokenManager {
    signAccess(payload: { userId: string }): Promise<string>;
    verifyAccess(token: string): Result<{ userId: string }, UnauthorizedError>;

    signVerificationEmail(payload: { userId: string }): Promise<string>;
    verifyVerificationEmail(token: string): Result<{ userId: string }, UnauthorizedError>;
}
