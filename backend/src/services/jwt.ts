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
        const decoded = jwt.verify(token, secret, options);

        if (typeof decoded !== 'object') {
            console.error('Invalid JWT format');
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
    const decoded = verifyJwt(token, secret, { audience: 'access' });

    if (!decoded) {
        return null;
    }

    if (!decoded.sub) {
        console.error('JWT does not contain an user ID');
        return null;
    }

    return decoded;
};
