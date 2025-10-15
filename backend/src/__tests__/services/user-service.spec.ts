import { UserService } from '../../services/UserService';
import {
    EmailAlreadyExistsError,
    EmailAlreadyVerifiedError,
} from '../../errors/ConflictError';
import { UserNotFoundError } from '../../errors/NotFoundError';
import { EmailVerificationCooldownError } from '../../errors/TooManyRequestsError';
import { MongoServerError, ObjectId } from 'mongodb';
import { JwtService } from '../../services/JwtService';
import { EmailService } from '../../services/EmailService';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../types/User';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_, value) => value),
}));

jest.mock('../../schemas/security', () => ({
    objectIdSchema: {},
}));

jest.mock('../../schemas/user', () => ({
    userSchema: {},
}));

describe('UserService', () => {
    let jwtService: jest.Mocked<JwtService>;
    let emailService: jest.Mocked<EmailService>;
    let userRepository: jest.Mocked<UserRepository>;
    let userService: UserService;
    let mockUser: User;

    beforeEach(() => {
        jwtService = {
            signEmailVerification: jest.fn(),
            verifyEmailVerification: jest.fn(),
        } as any;

        emailService = {
            sendVerification: jest.fn(),
        } as any;

        userRepository = {
            insertOne: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
        } as any;

        userService = new UserService(jwtService, emailService, userRepository);

        mockUser = {
            _id: new ObjectId(),
            email: 'test@example.com',
            passwordHash: 'hashed',
            isEmailVerified: false,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date(),
            updatedAt: null,
        };
    });

    describe('sendVerificationEmail()', () => {
        it('should send a verification email and update the cooldown', async () => {
            jwtService.signEmailVerification.mockReturnValue('jwt-token');
            userService.updateOne = jest.fn();

            await userService.sendVerificationEmail(
                mockUser,
                'https://frontend',
            );

            expect(jwtService.signEmailVerification).toHaveBeenCalledWith(
                mockUser._id,
            );
            expect(emailService.sendVerification).toHaveBeenCalledWith(
                mockUser.email,
                'https://frontend',
                'jwt-token',
            );
            expect(userService.updateOne).toHaveBeenCalled();
            expect(mockUser.emailVerificationCooldownExpiresAt).toBeInstanceOf(
                Date,
            );
        });

        it('should throw an error if the user is already verified', async () => {
            mockUser.isEmailVerified = true;
            await expect(
                userService.sendVerificationEmail(mockUser, 'https://frontend'),
            ).rejects.toThrow(EmailAlreadyVerifiedError);
        });

        it('should throw an error if the cooldown is still active', async () => {
            mockUser.emailVerificationCooldownExpiresAt = new Date(
                Date.now() + 10000,
            );
            await expect(
                userService.sendVerificationEmail(mockUser, 'https://frontend'),
            ).rejects.toThrow(EmailVerificationCooldownError);
        });
    });

    describe('verifyEmail()', () => {
        it('should verify the email and update the user', async () => {
            const userId = new ObjectId();
            jwtService.verifyEmailVerification.mockReturnValue({
                sub: userId.toString(),
                aud: 'email-verification',
                iat: 1234567890,
                exp: 1234567890 + 3600,
            });
            userService.findOneById = jest.fn().mockResolvedValue(mockUser);
            userService.updateOne = jest.fn();

            await userService.verifyEmail('jwt-token');

            expect(jwtService.verifyEmailVerification).toHaveBeenCalledWith(
                'jwt-token',
            );
            expect(userService.findOneById).toHaveBeenCalledWith(
                userId.toString(),
            );
            expect(mockUser.isEmailVerified).toBe(true);
            expect(userService.updateOne).toHaveBeenCalledWith(mockUser);
        });

        it('should throw an error if the user is already verified', async () => {
            mockUser.isEmailVerified = true;
            jwtService.verifyEmailVerification.mockReturnValue({
                sub: mockUser._id.toString(),
                aud: 'email-verification',
                iat: 1234567890,
                exp: 1234567890 + 3600,
            });
            userService.findOneById = jest.fn().mockResolvedValue(mockUser);

            await expect(userService.verifyEmail('jwt-token')).rejects.toThrow(
                EmailAlreadyVerifiedError,
            );
        });
    });

    describe('insertOne()', () => {
        it('should insert a user and return it', async () => {
            userRepository.insertOne.mockResolvedValue(undefined);
            const result = await userService.insertOne(
                'test@example.com',
                'hashed',
            );

            expect(result.email).toBe('test@example.com');
            expect(userRepository.insertOne).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'test@example.com' }),
            );
        });

        it('should throw an error if the email already exists', async () => {
            userRepository.insertOne.mockRejectedValue(
                Object.assign(new MongoServerError({}), { code: 11000 }),
            );

            await expect(
                userService.insertOne('test@example.com', 'hashed'),
            ).rejects.toThrow(EmailAlreadyExistsError);
        });

        it('should rethrow unexpected errors from userRepository.insertOne', async () => {
            const unexpectedError = new Error('Network failure');
            userRepository.insertOne.mockRejectedValue(unexpectedError);

            await expect(
                userService.insertOne('test@example.com', 'hashed'),
            ).rejects.toThrow(unexpectedError);
        });
    });

    describe('findOneById()', () => {
        it('should return a found user', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            const result = await userService.findOneById(mockUser._id);
            expect(result).toBe(mockUser);
        });

        it('should throw an error if no user is found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(userService.findOneById(mockUser._id)).rejects.toThrow(
                UserNotFoundError,
            );
        });
    });

    describe('findOneByEmail()', () => {
        it('should return a found user', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            const result = await userService.findOneByEmail('test@example.com');
            expect(result).toBe(mockUser);
        });

        it('should throw an error if no user is found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(
                userService.findOneByEmail('test@example.com'),
            ).rejects.toThrow(UserNotFoundError);
        });
    });

    describe('updateOne()', () => {
        it('should update a user and return the result', async () => {
            userRepository.updateOne.mockResolvedValue(undefined);
            const result = await userService.updateOne(mockUser);
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(userRepository.updateOne).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('removePasswordHash()', () => {
        it('should remove the passwordHash from the user', () => {
            const result = userService.removePasswordHash(mockUser);
            expect(result).not.toHaveProperty('passwordHash');
            expect(result.email).toBe(mockUser.email);
        });
    });
});
