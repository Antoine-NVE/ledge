import { sign, verify, Secret, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { InvalidJwtError } from '../errors/UnauthorizedErrors';

export default class JwtService {
    constructor(private secret: Secret) {}

    private signJwt(payload: object, options?: SignOptions): string {
        return sign(payload, this.secret, options);
    }

    signAccessJwt(userId: string): string {
        return this.signJwt({ sub: userId, aud: 'access' }, { expiresIn: '15m' });
    }

    signEmailVerificationJwt(userId: string): string {
        return this.signJwt({ sub: userId, aud: 'email-verification' }, { expiresIn: '1h' });
    }

    private verifyJwt(jwt: string, options?: VerifyOptions): JwtPayload {
        // Jwt can only be returned if we use 'complete: true' option, otherwise it's JwtPayload | string
        const decoded = verify(jwt, this.secret, options) as JwtPayload | string;

        // If the token is valid but does not contain a 'sub' claim, we consider it invalid
        if (typeof decoded !== 'object' || !decoded.sub) {
            throw new InvalidJwtError();
        }

        return decoded;
    }

    verifyAccessJwt(jwt: string): JwtPayload | null {
        return this.verifyJwt(jwt, { audience: 'access' });
    }

    verifyEmailVerificationJwt(jwt: string): JwtPayload | null {
        return this.verifyJwt(jwt, { audience: 'email-verification' });
    }
}
