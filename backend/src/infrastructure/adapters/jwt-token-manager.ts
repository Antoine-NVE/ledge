import {
    sign,
    verify,
    type Secret,
    type SignOptions,
    type VerifyOptions,
    TokenExpiredError,
    NotBeforeError,
} from 'jsonwebtoken';
import z from 'zod';
import type { TokenManager } from '../../application/ports/token-manager.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

export class JwtTokenManager implements TokenManager {
    constructor(private secret: Secret) {}

    private sign = async (payload: { aud: string; sub: string }, options: SignOptions): Promise<string> => {
        return sign(payload, this.secret, options);
    };

    private verify = (
        token: string,
        options: VerifyOptions,
    ): Result<{ sub: string; aud: string; iat: number; exp: number }, UnauthorizedError> => {
        try {
            const payload = z
                .object({
                    sub: z.string(),
                    aud: z.string(),
                    iat: z.number(),
                    exp: z.number(),
                })
                .parse(verify(token, this.secret, options));

            return ok(payload);
        } catch (err: unknown) {
            let message = 'Invalid token';
            if (err instanceof NotBeforeError) message = 'Inactive token';
            if (err instanceof TokenExpiredError) message = 'Expired token';

            return fail(new UnauthorizedError({ message, cause: err }));
        }
    };

    signAccess = ({ userId }: { userId: string }): Promise<string> => {
        return this.sign({ aud: 'access', sub: userId }, { expiresIn: '15m' });
    };

    verifyAccess = (token: string): Result<{ userId: string }, UnauthorizedError> => {
        const result = this.verify(token, { audience: 'access' });
        if (!result.success) {
            const err = result.error;
            return fail(new UnauthorizedError({ message: err.message, cause: err.cause, action: 'REFRESH' }));
        }
        const { sub } = result.value;

        return ok({ userId: sub });
    };

    signVerificationEmail = ({ userId }: { userId: string }): Promise<string> => {
        return this.sign({ aud: 'verification-email', sub: userId }, { expiresIn: '1h' });
    };

    verifyVerificationEmail = (token: string): Result<{ userId: string }, UnauthorizedError> => {
        const result = this.verify(token, { audience: 'verification-email' });
        if (!result.success) return fail(result.error);
        const { sub } = result.value;

        return ok({ userId: sub });
    };
}
