import jwt, { Secret, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

// Base function, only called in this service
const createJwt = (payload: object, secret: Secret, options?: SignOptions): string => {
    return jwt.sign(payload, secret, options);
};

export const createAccessTokenJwt = (userId: string, secret: Secret): string => {
    return createJwt({ sub: userId, aud: 'access' }, secret, { expiresIn: '15m' });
};

// Base function, only called in this service
const verifyJwt = (token: string, secret: Secret, options?: VerifyOptions): JwtPayload | null => {
    try {
        // jwt.Jwt can only be returned if we use 'complete: true' option, otherwise it's JwtPayload | string
        const decoded = jwt.verify(token, secret, options) as jwt.JwtPayload | string;

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

export const verifyAccessTokenJwt = (token: string, secret: Secret): JwtPayload | null => {
    return verifyJwt(token, secret, { audience: 'access' });
};
