import type { Result } from '../../core/types/result.js';
import type { TokenPayload } from '../types/token-payload.js';

export type VerifyTokenResult = Result<
    TokenPayload,
    { type: 'INACTIVE_TOKEN' } | { type: 'INVALID_TOKEN' } | { type: 'EXPIRED_TOKEN' }
>;

export interface TokenManager {
    signAccess(payload: TokenPayload): string;
    verifyAccess(accessToken: string): VerifyTokenResult;

    signEmailVerification(payload: TokenPayload): string;
    verifyEmailVerification(emailVerificationToken: string): VerifyTokenResult;
}
