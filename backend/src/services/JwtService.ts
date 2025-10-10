import {
    sign,
    verify,
    Secret,
    JwtPayload,
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

    private signJwt = (payload: object, options?: SignOptions): string => {
        return sign(payload, this.secret, options);
    };

    signAccessJwt = (userId: ObjectId): string => {
        return this.signJwt({ aud: 'access', sub: userId.toString() }, { expiresIn: '15m' });
    };

    signEmailVerificationJwt = (userId: ObjectId): string => {
        return this.signJwt(
            { aud: 'email-verification', sub: userId.toString() },
            { expiresIn: '1h' },
        );
    };

    private verifyJwt = (jwt: string, options?: VerifyOptions): Payload => {
        try {
            // TODO: create a real verification
            return verify(jwt, this.secret, options) as Payload;
        } catch (error: unknown) {
            if (error instanceof NotBeforeError) throw new InactiveJwtError();
            if (error instanceof TokenExpiredError) throw new ExpiredJwtError();

            throw new InvalidJwtError();
        }
    };

    verifyAccessJwt = (jwt: string): Payload => {
        try {
            return this.verifyJwt(jwt, { audience: 'access' });
        } catch (error: unknown) {
            if (error instanceof ExpiredJwtError) throw new ExpiredJwtError('refresh');

            throw error;
        }
    };

    verifyEmailVerificationJwt = (jwt: string): Payload => {
        return this.verifyJwt(jwt, { audience: 'email-verification' });
    };
}
