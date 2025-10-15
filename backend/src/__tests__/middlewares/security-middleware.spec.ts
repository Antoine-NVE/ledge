import { SecurityMiddleware } from '../../middlewares/SecurityMiddleware';
import { JwtService } from '../../services/JwtService';
import { UserService } from '../../services/UserService';
import { TransactionService } from '../../services/TransactionService';
import { CookieService } from '../../services/CookieService';
import { RequiredAccessTokenError } from '../../errors/UnauthorizedError';
import { UndefinedUserError } from '../../errors/InternalServerError';
import { TransactionAccessForbiddenError } from '../../errors/ForbiddenError';
import { ObjectId } from 'mongodb';
import { Transaction } from '../../types/Transaction';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_, value) => value),
}));

jest.mock('../../schemas/security', () => ({
    objectIdSchema: {},
}));

jest.mock('../../services/CookieService');

describe('SecurityMiddleware', () => {
    let jwtService: jest.Mocked<JwtService>;
    let userService: jest.Mocked<UserService>;
    let transactionService: jest.Mocked<TransactionService>;
    let middleware: SecurityMiddleware;
    let mockReq: any;
    let mockRes: any;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jwtService = { verifyAccess: jest.fn() } as any;
        userService = { findOneById: jest.fn() } as any;
        transactionService = { findOneById: jest.fn() } as any;

        middleware = new SecurityMiddleware(
            userService,
            transactionService,
            jwtService,
        );

        mockReq = { params: {}, cookies: {} };
        mockRes = {};
        mockNext = jest.fn();

        (CookieService as jest.Mock).mockImplementation(() => ({
            getAccessToken: jest.fn(),
        }));
    });

    describe('authenticateUser()', () => {
        it('should throw if access token is missing', async () => {
            const cookieService = new CookieService(mockReq, mockRes);
            (cookieService.getAccessToken as jest.Mock).mockReturnValue(
                undefined,
            );

            await expect(
                middleware.authenticateUser(mockReq, mockRes, mockNext),
            ).rejects.toThrow(RequiredAccessTokenError);
        });

        it('should verify the token and attach user to request', async () => {
            const mockGetAccessToken = jest.fn().mockReturnValue('token');
            (CookieService as jest.Mock).mockImplementation(() => ({
                getAccessToken: mockGetAccessToken,
            }));

            const userId = new ObjectId();
            jwtService.verifyAccess.mockReturnValue({
                sub: userId.toString(),
                iat: 0,
                exp: 0,
                aud: 'access',
            });
            const mockUser = { _id: userId, email: 'test@example.com' } as any;
            userService.findOneById.mockResolvedValue(mockUser);

            await middleware.authenticateUser(mockReq, mockRes, mockNext);

            expect(mockGetAccessToken).toHaveBeenCalled();
            expect(jwtService.verifyAccess).toHaveBeenCalledWith('token');
            expect(userService.findOneById).toHaveBeenCalledWith(
                userId.toString(),
            );
            expect(mockReq.user).toBe(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('authorizeTransaction()', () => {
        it('should throw if user is undefined', async () => {
            mockReq.user = undefined;
            await expect(
                middleware.authorizeTransaction(mockReq, mockRes, mockNext),
            ).rejects.toThrow(UndefinedUserError);
        });

        it('should throw if user does not own the transaction', async () => {
            const userId = new ObjectId();
            const transactionId = new ObjectId();

            mockReq.user = { _id: userId };
            mockReq.params.id = transactionId.toString();

            const transaction: Transaction = {
                _id: transactionId,
                month: '2023-10',
                name: 'Test',
                value: 100,
                isIncome: true,
                isRecurring: false,
                userId: new ObjectId(),
                createdAt: new Date(),
                updatedAt: null,
            };
            transactionService.findOneById.mockResolvedValue(transaction);

            await expect(
                middleware.authorizeTransaction(mockReq, mockRes, mockNext),
            ).rejects.toThrow(TransactionAccessForbiddenError);
        });

        it('should attach transaction and call next if authorized', async () => {
            const userId = new ObjectId();
            const transactionId = new ObjectId();

            mockReq.user = { _id: userId };
            mockReq.params.id = transactionId.toString();

            const transaction: Transaction = {
                _id: transactionId,
                month: '2023-10',
                name: 'Test',
                value: 100,
                isIncome: true,
                isRecurring: false,
                userId,
                createdAt: new Date(),
                updatedAt: null,
            };
            transactionService.findOneById.mockResolvedValue(transaction);

            mockReq.user._id.equals = (id: ObjectId) =>
                id.toString() === userId.toString();

            await middleware.authorizeTransaction(mockReq, mockRes, mockNext);

            expect(transactionService.findOneById).toHaveBeenCalledWith(
                transactionId.toString(),
            );
            expect(mockReq.transaction).toBe(transaction);
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
