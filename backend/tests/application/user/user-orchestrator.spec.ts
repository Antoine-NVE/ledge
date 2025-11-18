import { ObjectId } from 'mongodb';
import { UserService } from '../../../src/domain/user/user-service';
import { User } from '../../../src/domain/user/user-types';
import { ConflictError } from '../../../src/infrastructure/errors/conflict-error';
import { TooManyRequestsError } from '../../../src/infrastructure/errors/too-many-requests-error';
import { EmailService } from '../../../src/infrastructure/services/email-service';
import { JwtService } from '../../../src/infrastructure/services/jwt-service';
import { UserOrchestrator } from '../../../src/application/user/user-orchestrator';
import { CacheService } from '../../../src/infrastructure/services/cache-service';

describe('UserOrchestrator', () => {
    const TEST_URL = 'http://localhost:3000';
    const TEST_JWT = 'json-web-token';
    const TEST_OBJECT_ID = new ObjectId();
    const TEST_EMAIL_FROM = 'no-reply@example.com';

    let user: User;

    let jwtService: JwtService;
    let emailService: EmailService;
    let userService: UserService;
    let cacheServiceMock: CacheService;
    let userOrchestrator: UserOrchestrator;

    beforeEach(() => {
        user = {
            _id: TEST_OBJECT_ID,
            email: 'test@example.com',
        } as unknown as User;

        jwtService = {
            signVerificationEmail: jest.fn().mockReturnValue(TEST_JWT),
            verifyVerificationEmail: jest
                .fn()
                .mockReturnValue({ sub: TEST_OBJECT_ID }),
        } as unknown as JwtService;
        emailService = {
            sendVerification: jest.fn(),
        } as unknown as EmailService;
        userService = {
            setEmailVerificationCooldown: jest.fn(),
            findOneById: jest.fn().mockResolvedValue(user),
            markEmailAsVerified: jest.fn(),
        } as unknown as UserService;
        cacheServiceMock = {
            setVerificationEmailCooldown: jest.fn(),
            existsVerificationEmailCooldown: jest.fn().mockResolvedValue(false),
        } as unknown as CacheService;
        userOrchestrator = new UserOrchestrator(
            jwtService,
            emailService,
            userService,
            cacheServiceMock,
            TEST_EMAIL_FROM,
        );
    });

    describe('sendVerificationEmail', () => {
        it('should throw a ConflictError if email is already verified', () => {
            user = {
                isEmailVerified: true,
            } as unknown as User;

            expect(
                userOrchestrator.sendVerificationEmail(user, TEST_URL),
            ).rejects.toThrow(ConflictError);
        });

        it('should call cacheServiceMock.existsVerificationEmailCooldown and throw if false', async () => {
            (
                cacheServiceMock.existsVerificationEmailCooldown as jest.Mock
            ).mockResolvedValue(true);

            await expect(
                userOrchestrator.sendVerificationEmail(user, TEST_URL),
            ).rejects.toThrow(TooManyRequestsError);
        });

        it('should call jwtService to signVerificationEmail', async () => {
            await userOrchestrator.sendVerificationEmail(user, TEST_URL);

            expect(jwtService.signVerificationEmail).toHaveBeenCalledWith(
                user._id,
            );
        });

        it('should call emailService to sendVerification', async () => {
            await userOrchestrator.sendVerificationEmail(user, TEST_URL);

            expect(emailService.sendVerification).toHaveBeenCalledWith(
                TEST_EMAIL_FROM,
                user.email,
                TEST_URL,
                TEST_JWT,
            );
        });

        it('should call cacheService.setVerificationEmailCooldown', async () => {
            await userOrchestrator.sendVerificationEmail(user, TEST_URL);

            expect(
                cacheServiceMock.setVerificationEmailCooldown,
            ).toHaveBeenLastCalledWith(user._id);
        });
    });

    describe('verifyEmail', () => {
        it('should call jwtService to verifyVerificationEmail', async () => {
            await userOrchestrator.verifyEmail(TEST_JWT);

            expect(jwtService.verifyVerificationEmail).toHaveBeenLastCalledWith(
                TEST_JWT,
            );
        });

        it('should call userService to findOneById', async () => {
            await userOrchestrator.verifyEmail(TEST_JWT);

            expect(userService.findOneById).toHaveBeenCalledWith(
                TEST_OBJECT_ID,
            );
        });

        it('should throw a ConflictError if email is already verified', async () => {
            user = {
                ...user,
                isEmailVerified: true,
            };

            (userService.findOneById as jest.Mock).mockResolvedValue(user);

            await expect(
                userOrchestrator.verifyEmail(TEST_JWT),
            ).rejects.toThrow(ConflictError);
        });

        it('should call userService to markEmailAsVerified', async () => {
            await userOrchestrator.verifyEmail(TEST_JWT);

            expect(userService.markEmailAsVerified).toHaveBeenCalledWith(user);
        });
    });
});
