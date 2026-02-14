import type { Result } from '../../core/result.js';
import type { TokenPayload } from '../types/token-payload.js';

export type VerifyTokenResult = Result<TokenPayload, VerifyTokenError>;

export type VerifyTokenError = 'INACTIVE_TOKEN' | 'INVALID_TOKEN' | 'EXPIRED_TOKEN';

export interface TokenManager {
    signAccess: (payload: TokenPayload) => string;
    verifyAccess: (accessToken: string) => VerifyTokenResult;

    signEmailVerification: (payload: TokenPayload) => string;
    verifyEmailVerification: (emailVerificationToken: string) => VerifyTokenResult;
}
