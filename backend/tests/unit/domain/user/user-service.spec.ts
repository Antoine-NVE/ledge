import { User } from '../../../../src/domain/user/user-types';
import { UserRepository } from '../../../../src/domain/user/user-repository';
import { UserService } from '../../../../src/domain/user/user-service';

describe('UserService', () => {
    const EMAIL = 'test@example.com';
    const PASSWORD_HASH = 'pAsSwOrD-hAsH';
    const USER_ID = 'USERID123';

    let user: Partial<User>;

    let userRepositoryMock: Partial<UserRepository>;

    let userService: UserService;

    beforeEach(() => {
        user = {
            id: USER_ID,
        };

        userRepositoryMock = {
            create: jest.fn().mockResolvedValue(user),
            findById: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn().mockResolvedValue(user),
            save: jest.fn(),
        };

        userService = new UserService(userRepositoryMock as UserRepository);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('register', () => {
        it('should call this.userRepository.create', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await userService.register({
                email: EMAIL,
                passwordHash: PASSWORD_HASH,
            });

            expect(userRepositoryMock.create).toHaveBeenCalledWith({
                email: EMAIL,
                passwordHash: PASSWORD_HASH,
                isEmailVerified: false,
                createdAt: now,
            });
        });
    });

    describe('findById', () => {
        it('should call this.userRepository.findById', async () => {
            await userService.findById({ id: USER_ID });

            expect(userRepositoryMock.findById).toHaveBeenCalledWith(USER_ID);
        });

        // it('should throw NotFoundError if user is not found', async () => {
        //     (userRepository.findOne as jest.Mock).mockResolvedValue(null);
        //
        //     await expect(userService.findOneById(TEST_USER_ID)).rejects.toThrow(
        //         NotFoundError,
        //     );
        // });
    });

    describe('findByEmail', () => {
        it('should call this.userRepository.findByEmail', async () => {
            await userService.findByEmail({ email: EMAIL });

            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(EMAIL);
        });

        // it('should throw NotFoundError if user is not found', async () => {
        //     (userRepository.findOne as jest.Mock).mockResolvedValue(null);
        //
        //     await expect(
        //         userService.findOneByEmail(TEST_EMAIL),
        //     ).rejects.toThrow(NotFoundError);
        // });
    });

    describe('markEmailAsVerified', () => {
        it('should call this.userRepository.save', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await userService.markEmailAsVerified({ user: user as User });

            expect(userRepositoryMock.save).toHaveBeenCalledWith({
                id: USER_ID,
                isEmailVerified: true,
                updatedAt: now,
            });
        });
    });
});
