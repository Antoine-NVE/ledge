import { UserController } from '../../controllers/UserController';
import { UserService } from '../../services/UserService';
import { UndefinedUserError } from '../../errors/InternalServerError';
import { parseSchema } from '../../utils/schema';
import { User } from '../../types/User';
import { ObjectId } from 'mongodb';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_, value) => value),
}));

jest.mock('../../schemas/security', () => ({
    allowedOriginSchema: {},
    jwtSchema: {},
}));

describe('UserController', () => {
    let userService: jest.Mocked<UserService>;
    let controller: UserController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        userService = {
            sendVerificationEmail: jest.fn(),
            verifyEmail: jest.fn(),
            removePasswordHash: jest.fn(),
        } as any;

        controller = new UserController(userService);

        mockReq = { body: {}, user: undefined };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('sendVerificationEmail()', () => {
        it('should throw if user is undefined', async () => {
            mockReq.user = undefined;

            await expect(
                controller.sendVerificationEmail(mockReq, mockRes),
            ).rejects.toThrow(UndefinedUserError);
        });

        it('should call userService and return success message', async () => {
            const mockUser = { email: 'test@example.com' };
            mockReq.user = mockUser;
            mockReq.body.frontendBaseUrl = 'https://frontend.test';

            await controller.sendVerificationEmail(mockReq, mockRes);

            expect(userService.sendVerificationEmail).toHaveBeenCalledWith(
                mockUser,
                'https://frontend.test',
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Verification email sent successfully',
            });
        });
    });

    describe('verifyEmail()', () => {
        it('should call userService and return success message', async () => {
            mockReq.body.jwt = 'jwt-token';

            await controller.verifyEmail(mockReq, mockRes);

            expect(userService.verifyEmail).toHaveBeenCalledWith('jwt-token');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email verified successfully',
            });
        });
    });

    describe('me()', () => {
        it('should throw if user is undefined', async () => {
            mockReq.user = undefined;

            await expect(controller.me(mockReq, mockRes)).rejects.toThrow(
                UndefinedUserError,
            );
        });

        it('should return user data without password hash', async () => {
            const _id = new ObjectId();
            const createdAt = new Date();
            const updatedAt = new Date();

            const mockUser: User = {
                _id,
                email: 'test@example.com',
                passwordHash: 'abc',
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                createdAt,
                updatedAt,
            };
            const safeUser: Omit<User, 'passwordHash'> = {
                _id,
                email: 'test@example.com',
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                createdAt,
                updatedAt,
            };

            mockReq.user = mockUser;
            userService.removePasswordHash.mockReturnValue(safeUser);

            await controller.me(mockReq, mockRes);

            expect(userService.removePasswordHash).toHaveBeenCalledWith(
                mockUser,
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User retrieved successfully',
                data: { user: safeUser },
            });
        });
    });
});
