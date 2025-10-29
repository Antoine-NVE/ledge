import { MongoServerError, ObjectId } from 'mongodb';
import { UserRepository } from '../../../domain/user/user-repository';
import { UserService } from '../../../domain/user/user-service';
import { User } from '../../../domain/user/user-types';
import { ConflictError } from '../../../infrastructure/errors/conflict-error';
import { InternalServerError } from '../../../infrastructure/errors/internal-server-error';
import { NotFoundError } from '../../../infrastructure/errors/not-found-error';

describe('UserService', () => {
    const TEST_EMAIL = 'test@example.com';
    const TEST_PASSWORD_HASH = 'hashed-password';
    const TEST_USER_ID = new ObjectId();

    let user: User;

    let userRepository: UserRepository;
    let userService: UserService;

    beforeEach(() => {
        user = {
            _id: TEST_USER_ID,
        } as unknown as User;

        userRepository = {
            insertOne: jest.fn().mockReturnValue({
                catch: jest.fn(),
            }),
            findOne: jest.fn().mockResolvedValue(user),
            updateOne: jest.fn(),
        } as unknown as UserRepository;

        userService = new UserService(userRepository);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('register', () => {
        it('should call userRepository.insertOne', async () => {
            await userService.register(TEST_EMAIL, TEST_PASSWORD_HASH);

            expect(userRepository.insertOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: TEST_EMAIL,
                    passwordHash: TEST_PASSWORD_HASH,
                    isEmailVerified: false,
                    emailVerificationCooldownExpiresAt: null,
                    updatedAt: null,
                }),
            );
        });

        it('should throw a ConflictError if necessary', () => {
            const mongoError = Object.assign(new MongoServerError({}), {
                code: 11000,
            });

            (userRepository.insertOne as jest.Mock).mockRejectedValue(
                mongoError,
            );

            expect(
                userService.register(TEST_EMAIL, TEST_PASSWORD_HASH),
            ).rejects.toThrow(ConflictError);
        });

        it('should re-throw any other error', () => {
            (userRepository.insertOne as jest.Mock).mockRejectedValue(
                new InternalServerError(),
            );

            expect(
                userService.register(TEST_EMAIL, TEST_PASSWORD_HASH),
            ).rejects.toThrow(InternalServerError);
        });

        it('should return an user', async () => {
            const result = await userService.register(
                TEST_EMAIL,
                TEST_PASSWORD_HASH,
            );

            expect(result).toMatchObject({
                email: TEST_EMAIL,
                passwordHash: TEST_PASSWORD_HASH,
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                updatedAt: null,
            });
        });
    });

    describe('findOneById', () => {
        it('should call userRepository.findOne with correct parameters', async () => {
            await userService.findOneById(TEST_USER_ID);

            expect(userRepository.findOne).toHaveBeenCalledWith(
                '_id',
                TEST_USER_ID,
            );
        });

        it('should throw NotFoundError if user is not found', async () => {
            (userRepository.findOne as jest.Mock).mockResolvedValue(null);

            await expect(userService.findOneById(TEST_USER_ID)).rejects.toThrow(
                NotFoundError,
            );
        });

        it('should return the user if found', async () => {
            const result = await userService.findOneById(TEST_USER_ID);

            expect(result).toBe(user);
        });
    });

    describe('findOneByEmail', () => {
        it('should call userRepository.findOne with correct parameters', async () => {
            await userService.findOneByEmail(TEST_EMAIL);

            expect(userRepository.findOne).toHaveBeenCalledWith(
                'email',
                TEST_EMAIL,
            );
        });

        it('should throw NotFoundError if user is not found', async () => {
            (userRepository.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                userService.findOneByEmail(TEST_EMAIL),
            ).rejects.toThrow(NotFoundError);
        });

        it('should return the user if found', async () => {
            const result = await userService.findOneByEmail(TEST_EMAIL);

            expect(result).toBe(user);
        });
    });

    describe('setEmailVerificationCooldown', () => {
        it('should update user with cooldown timestamp', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await userService.setEmailVerificationCooldown(user);

            expect(userRepository.updateOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    updatedAt: now,
                    emailVerificationCooldownExpiresAt: new Date(
                        now.getTime() + 5 * 60 * 1000,
                    ),
                }),
            );
        });

        it('should return the updated user', async () => {
            const result = await userService.setEmailVerificationCooldown(user);
            expect(result).toBe(user);
        });
    });

    describe('markEmailAsVerified', () => {
        it('should update user with verified email', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await userService.markEmailAsVerified(user);

            expect(userRepository.updateOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    updatedAt: now,
                    isEmailVerified: true,
                }),
            );
        });

        it('should return the updated user', async () => {
            const result = await userService.markEmailAsVerified(user);
            expect(result).toBe(user);
        });
    });
});
