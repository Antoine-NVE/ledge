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
import { parseSchema } from '../utils/schema-utils';
import { verifySchema } from '../schemas/jwt-service-schemas';

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

        // Can throw internal server error
        return parseSchema(verifySchema, payload);
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
