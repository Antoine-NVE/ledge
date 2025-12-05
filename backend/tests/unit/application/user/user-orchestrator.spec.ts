import { User } from '../../../../src/domain/user/user-types';
import { TokenManager } from '../../../../src/application/ports/token-manager';
import { EmailSender } from '../../../../src/application/ports/email-sender';
import { UserService } from '../../../../src/domain/user/user-service';
import { CacheStore } from '../../../../src/application/ports/cache-store';
import { UserOrchestrator } from '../../../../src/application/user/user-orchestrator';

describe('UserOrchestrator', () => {
    const USER_ID = 'USERID123';
    const EMAIL = 'test@example.com';
    const FRONTEND_BASE_URL = 'http://localhost:3000';
    const TOKEN = 'token';
    const EMAIL_FROM = 'no-reply@example.com';

    let user: Partial<User>;

    let tokenManagerMock: Partial<TokenManager>;
    let emailSenderMock: Partial<EmailSender>;
    let userServiceMock: Partial<UserService>;
    let cacheStoreMock: Partial<CacheStore>;

    let userOrchestrator: UserOrchestrator;

    beforeEach(() => {
        user = {
            id: USER_ID,
            email: EMAIL,
        };

        tokenManagerMock = {
            signVerificationEmail: jest.fn().mockReturnValue(TOKEN),
            verifyVerificationEmail: jest
                .fn()
                .mockReturnValue({ userId: USER_ID }),
        };
        emailSenderMock = {
            sendVerification: jest.fn(),
        };
        userServiceMock = {
            findById: jest.fn().mockResolvedValue(user),
            markEmailAsVerified: jest.fn(),
        };
        cacheStoreMock = {
            setVerificationEmailCooldown: jest.fn(),
            existsVerificationEmailCooldown: jest.fn().mockResolvedValue(false),
        };

        userOrchestrator = new UserOrchestrator(
            tokenManagerMock as TokenManager,
            emailSenderMock as EmailSender,
            userServiceMock as UserService,
            cacheStoreMock as CacheStore,
            EMAIL_FROM,
        );
    });

    describe('sendVerificationEmail', () => {
        // it('should throw a ConflictError if email is already verified', () => {
        //     user = {
        //         isEmailVerified: true,
        //     } as unknown as User;
        //
        //     expect(
        //         userOrchestrator.sendVerificationEmail(user, TEST_URL),
        //     ).rejects.toThrow(ConflictError);
        // });

        it('should call this.cacheStore.existsVerificationEmailCooldown', async () => {
            await userOrchestrator.sendVerificationEmail({
                user: user as User,
                frontendBaseUrl: FRONTEND_BASE_URL,
            });

            expect(
                cacheStoreMock.existsVerificationEmailCooldown,
            ).toHaveBeenCalledWith(USER_ID);
        });

        it('should call this.tokenManager.signVerificationEmail', async () => {
            await userOrchestrator.sendVerificationEmail({
                user: user as User,
                frontendBaseUrl: FRONTEND_BASE_URL,
            });

            expect(tokenManagerMock.signVerificationEmail).toHaveBeenCalledWith(
                { userId: USER_ID },
            );
        });

        it('should call this.emailSender.sendVerification', async () => {
            await userOrchestrator.sendVerificationEmail({
                user: user as User,
                frontendBaseUrl: FRONTEND_BASE_URL,
            });

            expect(emailSenderMock.sendVerification).toHaveBeenCalledWith({
                from: EMAIL_FROM,
                to: EMAIL,
                frontendBaseUrl: FRONTEND_BASE_URL,
                token: TOKEN,
            });
        });

        it('should call this.cacheStore.setVerificationEmailCooldown', async () => {
            await userOrchestrator.sendVerificationEmail({
                user: user as User,
                frontendBaseUrl: FRONTEND_BASE_URL,
            });

            expect(
                cacheStoreMock.setVerificationEmailCooldown,
            ).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe('verifyEmail', () => {
        it('should call this.tokenManager.verifyVerificationEmail', async () => {
            await userOrchestrator.verifyEmail({ token: TOKEN });

            expect(
                tokenManagerMock.verifyVerificationEmail,
            ).toHaveBeenCalledWith(TOKEN);
        });

        it('should call this.userService.findById', async () => {
            await userOrchestrator.verifyEmail({ token: TOKEN });

            expect(userServiceMock.findById).toHaveBeenCalledWith({
                id: USER_ID,
            });
        });

        // it('should throw a ConflictError if email is already verified', async () => {
        //     user = {
        //         ...user,
        //         isEmailVerified: true,
        //     };
        //
        //     (userService.findOneById as jest.Mock).mockResolvedValue(user);
        //
        //     await expect(
        //         userOrchestrator.verifyEmail(TEST_JWT),
        //     ).rejects.toThrow(ConflictError);
        // });

        it('should call this.userService.markEmailAsVerified', async () => {
            await userOrchestrator.verifyEmail({ token: TOKEN });

            expect(userServiceMock.markEmailAsVerified).toHaveBeenCalledWith({
                user,
            });
        });

        it('should return user', async () => {
            const result = await userOrchestrator.verifyEmail({ token: TOKEN });

            expect(result).toEqual({ user });
        });
    });
});
