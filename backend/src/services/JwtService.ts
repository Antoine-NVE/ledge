import { sign, verify, Secret, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { InvalidJwtError } from '../errors/UnauthorizedError';
import { Types } from 'mongoose';

type VerifiedJwtPayload = Omit<JwtPayload, 'sub'> & { sub: string };

export class JwtService {
    constructor(private secret: Secret) {}

    private signJwt(payload: object, options?: SignOptions): string {
        return sign(payload, this.secret, options);
    }

    signAccessJwt(userId: Types.ObjectId): string {
        return this.signJwt({ sub: userId, aud: 'access' }, { expiresIn: '15m' });
    }

    signEmailVerificationJwt(userId: Types.ObjectId): string {
        return this.signJwt({ sub: userId, aud: 'email-verification' }, { expiresIn: '1h' });
    }

    private verifyJwt(jwt: string, options?: VerifyOptions): VerifiedJwtPayload {
        // Jwt can only be returned if we use 'complete: true' option, otherwise it's JwtPayload | string
        const decoded = verify(jwt, this.secret, options) as JwtPayload | string;

        // If the token is valid but does not contain a 'sub' claim, we consider it invalid
        if (typeof decoded !== 'object' || !decoded.sub) {
            throw new InvalidJwtError();
        }

        return decoded as VerifiedJwtPayload;
    }

    verifyAccessJwt(jwt: string): VerifiedJwtPayload {
        return this.verifyJwt(jwt, { audience: 'access' });
    }

    verifyEmailVerificationJwt(jwt: string): VerifiedJwtPayload {
        return this.verifyJwt(jwt, { audience: 'email-verification' });
    }
}
