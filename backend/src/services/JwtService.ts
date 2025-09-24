import { sign, verify, Secret, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

// Base function, only called in this service
const createJwt = (payload: object, secret: Secret, options?: SignOptions): string => {
    return sign(payload, secret, options);
};

export const createAccessJwt = (userId: string, secret: Secret): string => {
    return createJwt({ sub: userId, aud: 'access' }, secret, { expiresIn: '15m' });
};

export const createEmailVerificationJwt = (userId: string, secret: Secret): string => {
    return createJwt({ sub: userId, aud: 'email-verification' }, secret, { expiresIn: '1h' });
};

// Base function, only called in this service
const verifyJwt = (jwt: string, secret: Secret, options?: VerifyOptions): JwtPayload | null => {
    try {
        // Jwt can only be returned if we use 'complete: true' option, otherwise it's JwtPayload | string
        const decoded = verify(jwt, secret, options) as JwtPayload | string;

        if (typeof decoded !== 'object') {
            console.error('Invalid JWT format');
            return null;
        }

        if (!decoded.sub) {
            console.error('JWT does not contain a subject (sub)');
            return null;
        }

        return decoded;
    } catch (error) {
        // Catch expired token, invalid signature or audience errors
        console.error('JWT verification error:', error);
        return null;
    }
};

export const verifyAccessJwt = (jwt: string, secret: Secret): JwtPayload | null => {
    return verifyJwt(jwt, secret, { audience: 'access' });
};

export const verifyEmailVerificationJwt = (jwt: string, secret: Secret): JwtPayload | null => {
    return verifyJwt(jwt, secret, { audience: 'email-verification' });
};
