import {
    sign,
    verify,
    Secret,
    SignOptions,
    VerifyOptions,
    TokenExpiredError,
    NotBeforeError,
} from 'jsonwebtoken';
import z from 'zod';
import {
    SignAccessPayload,
    TokenManager,
    VerificationEmailPayload,
} from '../../application/ports/token-manager';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

export class JwtTokenManager implements TokenManager {
    constructor(private secret: Secret) {}

    private sign = (
        payload: { aud: string; sub: string },
        options: SignOptions,
    ) => {
        return sign(payload, this.secret, options);
    };

    private verify = (token: string, options: VerifyOptions) => {
        try {
            const data = z
                .object({
                    sub: z.string(),
                    aud: z.string(),
                    iat: z.number(),
                    exp: z.number(),
                })
                .parse(verify(token, this.secret, options));

            return { userId: data.sub };
        } catch (err: unknown) {
            if (err instanceof NotBeforeError) {
                throw new UnauthorizedError('Inactive JWT');
            }
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedError('Expired JWT');
            }
            throw new UnauthorizedError('Invalid JWT');
        }
    };

    signAccess = ({ userId }: SignAccessPayload): string => {
        return this.sign({ aud: 'access', sub: userId }, { expiresIn: '15m' });
    };

    verifyAccess = (token: string): SignAccessPayload => {
        try {
            return this.verify(token, { audience: 'access' });
        } catch (err: unknown) {
            if (err instanceof UnauthorizedError) {
                throw new UnauthorizedError(err.message, undefined, {
                    action: 'refresh',
                });
            }
            throw err;
        }
    };

    signVerificationEmail = ({ userId }: VerificationEmailPayload): string => {
        return this.sign(
            { aud: 'verification-email', sub: userId },
            { expiresIn: '1h' },
        );
    };

    verifyVerificationEmail = (token: string): VerificationEmailPayload => {
        return this.verify(token, { audience: 'verification-email' });
    };
}
