import { ObjectId } from 'mongodb';
import { JwtService } from '../../services/JwtService';
import jwt from 'jsonwebtoken';
import {
    ExpiredJwtError,
    InactiveJwtError,
    InvalidJwtError,
} from '../../errors/UnauthorizedError';

describe('JwtService', () => {
    let jwtService: JwtService;
    const secret = 'test-secret';

    beforeEach(() => {
        jwtService = new JwtService(secret);
    });

    describe('signAccess()', () => {
        it('should generate a valid JWT with audience "access"', () => {
            const userId = new ObjectId();
            const token = jwtService.signAccess(userId);

            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
            expect(decoded.aud).toBe('access');
            expect(decoded.sub).toBe(userId.toString());
        });
    });

    describe('signEmailVerification()', () => {
        it('should generate a valid JWT with audience "email-verification"', () => {
            const userId = new ObjectId();
            const token = jwtService.signEmailVerification(userId);

            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
            expect(decoded.aud).toBe('email-verification');
        });
    });

    describe('verifyAccess()', () => {
        it('should return the payload for a valid JWT', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                { aud: 'access', sub: userId.toString() },
                secret,
                { expiresIn: '15m' },
            );

            const payload = jwtService.verifyAccess(token);
            expect(payload.sub).toBe(userId.toString());
        });

        it('should throw InactiveJwtError for a not-before JWT', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                {
                    aud: 'access',
                    sub: userId.toString(),
                    nbf: Date.now() / 1000 + 60,
                }, // Not valid for another minute
                secret,
                { expiresIn: '15m' },
            );

            expect(() => jwtService.verifyAccess(token)).toThrow(
                InactiveJwtError,
            );
        });

        it('should throw ExpiredJwtError for an expired JWT', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                { aud: 'access', sub: userId.toString() },
                secret,
                { expiresIn: '-1s' },
            );

            expect(() => jwtService.verifyAccess(token)).toThrow(
                ExpiredJwtError,
            );
        });

        it('should throw InvalidJwtError for a JWT with wrong audience', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                { aud: 'wrong-audience', sub: userId.toString() },
                secret,
                { expiresIn: '15m' },
            );

            expect(() => jwtService.verifyAccess(token)).toThrow(
                InvalidJwtError,
            );
        });
    });

    describe('verifyEmailVerification()', () => {
        it('should return the payload for a valid JWT', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                { aud: 'email-verification', sub: userId.toString() },
                secret,
                { expiresIn: '15m' },
            );

            const payload = jwtService.verifyEmailVerification(token);
            expect(payload.sub).toBe(userId.toString());
        });

        it('should throw InactiveJwtError for a not-before JWT', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                {
                    aud: 'email-verification',
                    sub: userId.toString(),
                    nbf: Date.now() / 1000 + 60,
                }, // Not valid for another minute
                secret,
                { expiresIn: '15m' },
            );

            expect(() => jwtService.verifyEmailVerification(token)).toThrow(
                InactiveJwtError,
            );
        });

        it('should throw ExpiredJwtError for an expired JWT', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                { aud: 'email-verification', sub: userId.toString() },
                secret,
                { expiresIn: '-1s' },
            );

            expect(() => jwtService.verifyEmailVerification(token)).toThrow(
                ExpiredJwtError,
            );
        });

        it('should throw InvalidJwtError for a JWT with wrong audience', () => {
            const userId = new ObjectId();
            const token = jwt.sign(
                { aud: 'wrong-audience', sub: userId.toString() },
                secret,
                { expiresIn: '15m' },
            );

            expect(() => jwtService.verifyEmailVerification(token)).toThrow(
                InvalidJwtError,
            );
        });
    });
});
