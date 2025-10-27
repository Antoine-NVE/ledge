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
import { verifySchema } from '../schemas/jwt-service-schemas';
import { InternalServerError } from '../errors/internal-server-error';
import { formatZodError } from '../utils/format-utils';

export class JwtService {
    constructor(private secret: Secret) {}

    private sign = (payload: object, options?: SignOptions): string => {
        return sign(payload, this.secret, options);
    };

    signAccess = (userId: ObjectId): string => {
        return this.sign(
            { aud: 'access', sub: userId.toString() },
            { expiresIn: '15m' },
        );
    };

    signEmailVerification = (userId: ObjectId): string => {
        return this.sign(
            { aud: 'email-verification', sub: userId.toString() },
            { expiresIn: '1h' },
        );
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

        const { success, data, error } = verifySchema.safeParse(payload);

        if (!success) {
            throw new InternalServerError(
                'Invalid JWT payload',
                formatZodError(error),
            );
        }

        return data;
    };

    verifyAccess = (jwt: string) => {
        try {
            return this.verify(jwt, { audience: 'access' });
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError)
                throw new UnauthorizedError(error.message, undefined, {
                    action: 'refresh',
                });

            // Should only re-throw internal server error
            throw error;
        }
    };

    verifyEmailVerification = (jwt: string) => {
        return this.verify(jwt, { audience: 'email-verification' });
    };
}
