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
import { Payload } from '../types/payload-type';
import { UnauthorizedError } from '../errors/unauthorized-error';

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

    private verify = (jwt: string, options?: VerifyOptions): Payload => {
        try {
            // TODO: create a real verification
            return verify(jwt, this.secret, options) as Payload;
        } catch (error: unknown) {
            if (error instanceof NotBeforeError)
                throw new UnauthorizedError('Inactive JWT');
            if (error instanceof TokenExpiredError)
                throw new UnauthorizedError('Expired JWT');

            throw new UnauthorizedError('Invalid JWT');
        }
    };

    verifyAccess = (jwt: string): Payload => {
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

    verifyEmailVerification = (jwt: string): Payload => {
        return this.verify(jwt, { audience: 'email-verification' });
    };
}
