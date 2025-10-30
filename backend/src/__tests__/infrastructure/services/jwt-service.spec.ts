import { ObjectId } from 'mongodb';
import { JwtService } from '../../../infrastructure/services/jwt-service';
import { sign, verify, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { formatZodError } from '../../../infrastructure/utils/format-utils';
import { verifySchema } from '../../../infrastructure/schemas/jwt-service-schemas';

jest.mock('jsonwebtoken');
jest.mock('../../../infrastructure/schemas/jwt-service-schemas');
jest.mock('../../../infrastructure/utils/format-utils');

describe('JwtService', () => {
    const secret = 'a-strong-secret';
    const jwt = 'json-web-token';

    let jwtService: JwtService;
    let signMock: jest.Mock;
    let verifyMock: jest.Mock;
    let safeParseMock: jest.Mock;

    beforeEach(() => {
        signMock = sign as jest.Mock;
        signMock.mockReturnValue(jwt);
        verifyMock = verify as jest.Mock;
        safeParseMock = verifySchema.safeParse as jest.Mock;

        jwtService = new JwtService(secret);
    });

    describe('signAccess', () => {
        it('signs an access token with correct payload and options', () => {
            const userId = {
                toString: () => '507f1f77bcf86cd799439011',
            } as ObjectId;

            const token = jwtService.signAccess(userId);

            expect(token).toBe(jwt);
            expect(signMock).toHaveBeenCalledWith(
                { aud: 'access', sub: userId.toString() },
                secret,
                { expiresIn: '15m' },
            );
        });
    });

    describe('signVerificationEmail', () => {
        it('signs a verification email token with correct payload and options', () => {
            const userId = {
                toString: () => '507f1f77bcf86cd799439011',
            } as ObjectId;

            const token = jwtService.signVerificationEmail(userId);

            expect(token).toBe(jwt);
            expect(signMock).toHaveBeenCalledWith(
                { aud: 'verification-email', sub: userId.toString() },
                secret,
                { expiresIn: '1h' },
            );
        });
    });

    describe('verifyAccess', () => {
        const audience = 'access';

        const successScenario = (payload: any) => {
            verifyMock.mockReturnValue(payload);
            safeParseMock.mockReturnValue({ success: true, data: payload });

            const result = jwtService.verifyAccess(jwt);

            expect(result).toBe(payload);
            expect(verifyMock).toHaveBeenCalledWith(jwt, secret, { audience });
        };

        it('verifies an access token and returns parsed payload', () => {
            const payload = { aud: audience, sub: '507f1f77bcf86cd799439011' };
            successScenario(payload);
        });

        it('wraps JWT verification errors into UnauthorizedError with action refresh', () => {
            verifyMock.mockImplementation(() => {
                throw new Error('some error');
            });

            expect(() => jwtService.verifyAccess(jwt)).toThrow('Invalid JWT');
            expect(verifyMock).toHaveBeenCalledWith(jwt, secret, { audience });
        });

        it('throws BadRequestError when payload validation fails', () => {
            const payload = { aud: audience, sub: '507f1f77bcf86cd799439011' };
            verifyMock.mockReturnValue(payload);
            const zodError = { issues: [] };
            safeParseMock.mockReturnValue({ success: false, error: zodError });

            expect(() => jwtService.verifyAccess(jwt)).toThrow(
                'Invalid JWT payload',
            );
            expect(formatZodError).toHaveBeenCalledWith(zodError);
        });
    });

    describe('verifyVerificationEmail', () => {
        const audience = 'verification-email';

        const successScenario = (payload: any) => {
            verifyMock.mockReturnValue(payload);
            safeParseMock.mockReturnValue({ success: true, data: payload });

            const result = jwtService.verifyVerificationEmail(jwt);

            expect(result).toBe(payload);
            expect(verifyMock).toHaveBeenCalledWith(jwt, secret, { audience });
        };

        it('verifies a verification email token and returns parsed payload', () => {
            const payload = { aud: audience, sub: '507f1f77bcf86cd799439011' };
            successScenario(payload);
        });

        it('maps NotBeforeError to Inactive JWT', () => {
            const nbError = Object.create(NotBeforeError.prototype);
            nbError.message = 'nb';
            verifyMock.mockImplementation(() => {
                throw nbError;
            });

            expect(() => jwtService.verifyVerificationEmail(jwt)).toThrow(
                'Inactive JWT',
            );
            expect(verifyMock).toHaveBeenCalledWith(jwt, secret, { audience });
        });

        it('maps TokenExpiredError to Expired JWT', () => {
            const teError = Object.create(TokenExpiredError.prototype);
            teError.message = 'expired';
            verifyMock.mockImplementation(() => {
                throw teError;
            });

            expect(() => jwtService.verifyVerificationEmail(jwt)).toThrow(
                'Expired JWT',
            );
            expect(verifyMock).toHaveBeenCalledWith(jwt, secret, { audience });
        });

        it('throws BadRequestError when payload validation fails', () => {
            const payload = { aud: audience, sub: '507f1f77bcf86cd799439011' };
            verifyMock.mockReturnValue(payload);
            const zodError = { issues: [] };
            safeParseMock.mockReturnValue({ success: false, error: zodError });

            expect(() => jwtService.verifyVerificationEmail(jwt)).toThrow(
                'Invalid JWT payload',
            );
            expect(formatZodError).toHaveBeenCalledWith(zodError);
        });
    });
});
