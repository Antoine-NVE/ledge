import {
    sign,
    verify,
    Secret,
    SignOptions,
    VerifyOptions,
    TokenExpiredError,
    NotBeforeError,
} from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { formatZodError } from '../utils/format';
import { BadRequestError } from '../errors/bad-request-error';
import z from 'zod';
import { TokenManager } from '../../application/ports/token-manager';

export class JwtTokenManager implements TokenManager {
    constructor(private secret: Secret) {}

    private sign = (payload: object, options?: SignOptions): string => {
        return sign(payload, this.secret, options);
    };

    private verify = (jwt: string, options?: VerifyOptions) => {
        let payload;

        try {
            payload = verify(jwt, this.secret, options);
        } catch (error: unknown) {
            if (error instanceof NotBeforeError)
                throw new UnauthorizedError('Inactive JWT');
            if (error instanceof TokenExpiredError)
                throw new UnauthorizedError('Expired JWT');

            throw new UnauthorizedError('Invalid JWT');
        }

        const result = z
            .object({
                sub: z
                    .string()
                    .refine((val) => ObjectId.isValid(val))
                    .transform((val) => new ObjectId(val)),
            })
            .safeParse(payload);

        if (!result.success) {
            throw new BadRequestError(
                'Invalid JWT payload',
                formatZodError(result.error),
            );
        }

        return result.data.sub;
    };

    signAccess = (userId: ObjectId): string => {
        return this.sign(
            { aud: 'access', sub: userId.toString() },
            { expiresIn: '15m' },
        );
    };

    verifyAccess = (jwt: string) => {
        try {
            return this.verify(jwt, { audience: 'access' });
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError)
                throw new UnauthorizedError(error.message, undefined, {
                    action: 'refresh',
                });

            throw error;
        }
    };

    signVerificationEmail = (userId: ObjectId): string => {
        return this.sign(
            { aud: 'verification-email', sub: userId.toString() },
            { expiresIn: '1h' },
        );
    };

    verifyVerificationEmail = (jwt: string) => {
        return this.verify(jwt, { audience: 'verification-email' });
    };
}
