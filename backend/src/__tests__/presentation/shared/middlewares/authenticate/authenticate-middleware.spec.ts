import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../../../../presentation/shared/middlewares/authenticate/authenticate-middleware';
import { JwtService } from '../../../../../infrastructure/services/jwt-service';
import { UserService } from '../../../../../domain/user/user-service';
import { CookieService } from '../../../../../infrastructure/services/cookie-service';
import { UnauthorizedError } from '../../../../../infrastructure/errors/unauthorized-error';

jest.mock('../../../../../infrastructure/services/cookie-service');

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

        const middleware = authenticate(jwtService, userService);

        await expect(middleware(req, res, next)).rejects.toThrow(
            UnauthorizedError,
        );
        expect(next).not.toHaveBeenCalled();
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

        const middleware = authenticate(jwtService, userService);
        await middleware(req, res, next);

        expect(jwtService.verifyAccess).toHaveBeenCalledWith(token);
        expect(userService.findOneById).toHaveBeenCalledWith('123');
        expect(req.user).toBe(user);
        expect(next).toHaveBeenCalled();
    });
});
