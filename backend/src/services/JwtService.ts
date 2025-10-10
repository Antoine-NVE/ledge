import { sign, verify, Secret, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { InvalidJwtError } from '../errors/UnauthorizedError';
import { ObjectId } from 'mongodb';

type VerifiedJwtPayload = Omit<JwtPayload, 'sub'> & { sub: string };

export class JwtService {
    constructor(private secret: Secret) {}

    private signJwt = (payload: object, options?: SignOptions): string => {
        return sign(payload, this.secret, options);
    };

    signAccessJwt = (userId: ObjectId): string => {
        return this.signJwt({ aud: 'access', sub: userId }, { expiresIn: '15m' });
    };

    signEmailVerificationJwt = (userId: ObjectId): string => {
        return this.signJwt({ aud: 'email-verification', sub: userId }, { expiresIn: '1h' });
    };

    private verifyJwt = (jwt: string, options?: VerifyOptions): VerifiedJwtPayload => {
        try {
            // Jwt can only be returned if we use 'complete: true' option, otherwise it's JwtPayload | string
            // TODO: create a real verification
            const decoded = verify(jwt, this.secret, options) as JwtPayload | string;

            // If the token is valid but does not contain a 'sub' claim, we consider it invalid
            if (typeof decoded !== 'object' || !decoded.sub) {
                throw new InvalidJwtError();
            }

            return decoded as VerifiedJwtPayload;
        } catch (error) {
            throw new InvalidJwtError();
        }
    };

    verifyAccessJwt = (jwt: string): VerifiedJwtPayload => {
        return this.verifyJwt(jwt, { audience: 'access' });
    };

    verifyEmailVerificationJwt = (jwt: string): VerifiedJwtPayload => {
        return this.verifyJwt(jwt, { audience: 'email-verification' });
    };
}
