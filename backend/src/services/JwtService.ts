import {
    sign,
    verify,
    Secret,
    SignOptions,
    VerifyOptions,
    TokenExpiredError,
    NotBeforeError,
} from 'jsonwebtoken';
import { ExpiredJwtError, InactiveJwtError, InvalidJwtError } from '../errors/UnauthorizedError';
import { ObjectId } from 'mongodb';
import { Payload } from '../types/Payload';

export class JwtService {
    constructor(private secret: Secret) {}

    private sign = (payload: object, options?: SignOptions): string => {
        return sign(payload, this.secret, options);
    };

    signAccess = (userId: ObjectId): string => {
        return this.sign({ aud: 'access', sub: userId.toString() }, { expiresIn: '15m' });
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
            if (error instanceof NotBeforeError) throw new InactiveJwtError();
            if (error instanceof TokenExpiredError) throw new ExpiredJwtError();

            throw new InvalidJwtError();
        }
    };

    verifyAccess = (jwt: string): Payload => {
        try {
            return this.verify(jwt, { audience: 'access' });
        } catch (error: unknown) {
            if (error instanceof ExpiredJwtError) throw new ExpiredJwtError('refresh');

            throw error;
        }
    };

    verifyEmailVerification = (jwt: string): Payload => {
        return this.verify(jwt, { audience: 'email-verification' });
    };
}
