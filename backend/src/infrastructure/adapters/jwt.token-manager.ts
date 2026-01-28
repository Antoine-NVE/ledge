import jwt from 'jsonwebtoken';
import type { TokenManager, VerifyTokenResult } from '../../domain/ports/token-manager.js';
import { fail, ok } from '../../core/utils/result.js';

type JwtTokenPayload = {
    sub: string;
    aud: string;
    iat: number;
    exp: number;
};

export class JwtTokenManager implements TokenManager {
    constructor(private secret: string) {}

    signAccess = ({ userId }: { userId: string }): string => {
        return jwt.sign({ sub: userId }, this.secret, { audience: 'access', expiresIn: '15 minutes' });
    };

    verifyAccess = (accessToken: string): VerifyTokenResult => {
        try {
            const { sub } = jwt.verify(accessToken, this.secret, { audience: 'access' }) as JwtTokenPayload;

            return ok({ userId: sub });
        } catch (err: unknown) {
            if (err instanceof jwt.NotBeforeError) return fail({ type: 'INACTIVE_TOKEN' });
            if (err instanceof jwt.JsonWebTokenError) return fail({ type: 'INVALID_TOKEN' });
            if (err instanceof jwt.TokenExpiredError) return fail({ type: 'EXPIRED_TOKEN' });
            throw err;
        }
    };

    signEmailVerification = ({ userId }: { userId: string }): string => {
        return jwt.sign({ sub: userId }, this.secret, { audience: 'email-verification', expiresIn: '1 hour' });
    };

    verifyEmailVerification = (emailVerificationToken: string): VerifyTokenResult => {
        try {
            const { sub } = jwt.verify(emailVerificationToken, this.secret, {
                audience: 'email-verification',
            }) as JwtTokenPayload;

            return ok({ userId: sub });
        } catch (err: unknown) {
            if (err instanceof jwt.NotBeforeError) return fail({ type: 'INACTIVE_TOKEN' });
            if (err instanceof jwt.JsonWebTokenError) return fail({ type: 'INVALID_TOKEN' });
            if (err instanceof jwt.TokenExpiredError) return fail({ type: 'EXPIRED_TOKEN' });
            throw err;
        }
    };
}
