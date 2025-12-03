import {
    sign,
    verify,
    Secret,
    SignOptions,
    VerifyOptions,
    TokenExpiredError,
    NotBeforeError,
} from 'jsonwebtoken';
import { formatZodError } from '../utils/format';
import z from 'zod';
import {
    SignAccessPayload,
    TokenManager,
    VerificationEmailPayload,
} from '../../application/ports/token-manager';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { BadRequestError } from '../../core/errors/bad-request-error';

export class JwtTokenManager implements TokenManager {
    constructor(private secret: Secret) {}

    private sign = (
        payload: { aud: string; sub: string },
        options: SignOptions,
    ) => {
        return sign(payload, this.secret, options);
    };

    private verify = (token: string, options: VerifyOptions) => {
        let payload;
        try {
            payload = verify(token, this.secret, options);
        } catch (error: unknown) {
            if (error instanceof NotBeforeError) {
                throw new UnauthorizedError('Inactive JWT');
            }

            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedError('Expired JWT');
            }

            throw new UnauthorizedError('Invalid JWT');
        }

        // Only sub isn't yet verified, but it could be useful to have access to other values
        const { success, data, error } = z
            .object({
                sub: z.string(),
                aud: z.string(),
                iat: z.number(),
                exp: z.number(),
            })
            .safeParse(payload);

        if (!success) {
            throw new BadRequestError(
                'Invalid JWT payload',
                formatZodError(error),
            );
        }

        return { userId: data.sub };
    };

    signAccess = ({ userId }: SignAccessPayload): string => {
        return this.sign({ aud: 'access', sub: userId }, { expiresIn: '15m' });
    };

    verifyAccess = (token: string): SignAccessPayload => {
        try {
            return this.verify(token, { audience: 'access' });
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError)
                throw new UnauthorizedError(error.message, undefined, {
                    action: 'refresh',
                });

            throw error;
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
