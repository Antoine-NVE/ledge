import jwt from 'jsonwebtoken';
import z from 'zod';
import type { TokenManager } from '../../application/ports/token-manager.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import type { IdManager } from '../../application/ports/id-manager.js';

const verifySchema = (idManager: IdManager) => {
    return z.object({
        sub: z.string().refine((value) => idManager.validate(value)),
        aud: z.string(),
        iat: z.number(),
        exp: z.number(),
    });
};

export class JwtTokenManager implements TokenManager {
    constructor(
        private idManager: IdManager,
        private secret: jwt.Secret,
    ) {}

    private sign = async (payload: { aud: string; sub: string }, options: jwt.SignOptions): Promise<string> => {
        return jwt.sign(payload, this.secret, options);
    };

    private verify = (
        token: string,
        options: jwt.VerifyOptions,
    ): Result<{ sub: string; aud: string; iat: number; exp: number }, UnauthorizedError> => {
        try {
            const payload = verifySchema(this.idManager).parse(jwt.verify(token, this.secret, options));

            return ok(payload);
        } catch (err: unknown) {
            let message = 'Invalid token';
            if (err instanceof jwt.NotBeforeError) message = 'Inactive token';
            if (err instanceof jwt.TokenExpiredError) message = 'Expired token';

            return fail(new UnauthorizedError({ message, cause: err }));
        }
    };

    signAccess = ({ userId }: { userId: string }): Promise<string> => {
        return this.sign({ aud: 'access', sub: userId }, { expiresIn: '15m' });
    };

    verifyAccess = (accessToken: string): Result<{ userId: string }, UnauthorizedError> => {
        const result = this.verify(accessToken, { audience: 'access' });
        if (!result.success) {
            return fail(
                new UnauthorizedError({ message: result.error.message, cause: result.error.cause, action: 'REFRESH' }),
            );
        }
        const { sub } = result.data;

        return ok({ userId: sub });
    };

    signEmailVerification = ({ userId }: { userId: string }): Promise<string> => {
        return this.sign({ aud: 'email-verification', sub: userId }, { expiresIn: '1h' });
    };

    verifyEmailVerification = (emailVerificationToken: string): Result<{ userId: string }, UnauthorizedError> => {
        const result = this.verify(emailVerificationToken, { audience: 'email-verification' });
        if (!result.success) return fail(result.error);
        const { sub } = result.data;

        return ok({ userId: sub });
    };
}
