import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../../../src/infrastructure/adapters/jwt-token-manager';
import { UserService } from '../../../../../src/domain/user/user-service';
import { CookieService } from '../../../../../src/infrastructure/adapters/cookie-service';
import { UnauthorizedError } from '../../../../../src/infrastructure/errors/unauthorized-error';
import { NotFoundError } from '../../../../../src/infrastructure/errors/not-found-error';
import { InternalServerError } from '../../../../../src/infrastructure/errors/internal-server-error';
import { createAuthenticateMiddleware } from '../../../../../src/presentation/middlewares/business/auth/authenticate';

jest.mock('../../../../../src/infrastructure/adapters/cookie-service');

describe('authenticate middleware', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let jwtService: jest.Mocked<JwtService>;
    let userService: jest.Mocked<UserService>;
    let cookieServiceMock: jest.Mocked<CookieService>;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        next = jest.fn();

        jwtService = {
            verifyAccess: jest.fn(),
        } as unknown as jest.Mocked<JwtService>;
        userService = {
            findOneById: jest.fn(),
        } as unknown as jest.Mocked<UserService>;
        (CookieService as jest.Mock).mockClear();
    });

    it('throws UnauthorizedError if no access token', async () => {
        cookieServiceMock = {
            getAccessToken: jest.fn().mockReturnValue(null),
        } as unknown as jest.Mocked<CookieService>;
        (CookieService as jest.Mock).mockImplementation(
            () => cookieServiceMock,
        );

        const authenticate = createAuthenticateMiddleware(
            jwtService,
            userService,
        );

        await expect(authenticate(req, res, next)).rejects.toThrow(
            UnauthorizedError,
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw an UnauthorizedError if user is not found', async () => {
        const token = 'valid-token';

        cookieServiceMock = {
            getAccessToken: jest.fn().mockReturnValue(token),
        } as unknown as jest.Mocked<CookieService>;
        (CookieService as jest.Mock).mockImplementation(
            () => cookieServiceMock,
        );
        (jwtService.verifyAccess as jest.Mock).mockReturnValue({ sub: '123' });

        (userService.findOneById as jest.Mock).mockRejectedValue(
            new NotFoundError(),
        );

        let authenticate = createAuthenticateMiddleware(
            jwtService,
            userService,
        );

        await expect(authenticate(req, res, next)).rejects.toThrow(
            UnauthorizedError,
        );

        (userService.findOneById as jest.Mock).mockRejectedValue(
            new InternalServerError(),
        );

        authenticate = createAuthenticateMiddleware(jwtService, userService);

        await expect(authenticate(req, res, next)).rejects.toThrow(
            InternalServerError,
        );
    });

    it('sets req.user and calls next if token is valid', async () => {
        const token = 'valid-token';
        const user = { id: '123', email: 'test@test.com' };

        cookieServiceMock = {
            getAccessToken: jest.fn().mockReturnValue(token),
        } as unknown as jest.Mocked<CookieService>;
        (CookieService as jest.Mock).mockImplementation(
            () => cookieServiceMock,
        );
        (jwtService.verifyAccess as jest.Mock).mockReturnValue({ sub: '123' });
        (userService.findOneById as jest.Mock).mockResolvedValue(user);

        const authenticate = createAuthenticateMiddleware(
            jwtService,
            userService,
        );
        await authenticate(req, res, next);

        expect(jwtService.verifyAccess).toHaveBeenCalledWith(token);
        expect(userService.findOneById).toHaveBeenCalledWith('123');
        expect(req.user).toBe(user);
        expect(next).toHaveBeenCalled();
    });
});
