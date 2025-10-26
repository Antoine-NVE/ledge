import { ObjectId } from 'mongodb';
import { JwtService } from '../../services/jwt-service';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../infrastructure/errors/unauthorized-error';

describe('JwtService', () => {
    let jwtService: JwtService;
    const secret = 'my-secret';

    beforeEach(() => {
        jest.clearAllMocks();

        jwtService = new JwtService(secret);
    });

    describe('signAccess', () => {
        it('should create a valid access JWT', () => {
            const userId = new ObjectId();

            const token = jwtService.signAccess(userId);
            const payload = jwt.decode(token) as jwt.JwtPayload;
            expect(payload.sub).toBe(userId.toString());
            expect(payload.aud).toBe('access');
            expect(Number(payload.exp) - Number(payload.iat)).toBe(900); // 15 minutes
        });
    });

    describe('signEmailVerification', () => {
        it('should create a valid email verification JWT', () => {
            const userId = new ObjectId();

            const token = jwtService.signEmailVerification(userId);
            const payload = jwt.decode(token) as jwt.JwtPayload;
            expect(payload.sub).toBe(userId.toString());
            expect(payload.aud).toBe('email-verification');
            expect(Number(payload.exp) - Number(payload.iat)).toBe(3600); // 1 hour
        });
    });

    const accessJwt = jwt.sign(
        {
            sub: new ObjectId().toString(),
            aud: 'access',
        },
        secret,
        {
            expiresIn: '15m',
        },
    );

    const expiredAccessJwt = jwt.sign(
        {
            sub: new ObjectId().toString(),
            aud: 'access',
        },
        secret,
        {
            expiresIn: '-1',
        },
    );

    const inactiveAccessJwt = jwt.sign(
        {
            sub: new ObjectId().toString(),
            aud: 'access',
        },
        secret,
        {
            expiresIn: '15m',
            notBefore: '5m',
        },
    );

    const emailVerificationJwt = jwt.sign(
        {
            sub: new ObjectId().toString(),
            aud: 'email-verification',
        },
        secret,
        {
            expiresIn: '1h',
        },
    );

    describe('verifyAccess', () => {
        it('should not throw an error with valid JWT', () => {
            expect(() => jwtService.verifyAccess(accessJwt)).not.toThrow();
        });

        it('should throw an error with invalid aud', () => {
            expect(() =>
                jwtService.verifyAccess(emailVerificationJwt),
            ).toThrow();
        });

        it('should throw UnauthorizedError with expired JWT', () => {
            expect(() => {
                jwtService.verifyAccess(expiredAccessJwt);
            }).toThrow(UnauthorizedError);
        });

        it('should throw UnauthorizedError with inactive JWT', () => {
            expect(() => {
                jwtService.verifyAccess(inactiveAccessJwt);
            }).toThrow(UnauthorizedError);
        });
    });

    describe('verifyEmailVerification', () => {
        it('should not throw an error with valid JWT', () => {
            expect(() =>
                jwtService.verifyEmailVerification(emailVerificationJwt),
            ).not.toThrow();
        });

        it('should throw an error with invalid aud', () => {
            expect(() =>
                jwtService.verifyEmailVerification(accessJwt),
            ).toThrow();
        });
    });
});
