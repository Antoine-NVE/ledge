import { ObjectId } from 'mongodb';
import { UserService } from '../../../domain/user/user-service';
import { User } from '../../../domain/user/user-types';
import { ConflictError } from '../../../infrastructure/errors/conflict-error';
import { TooManyRequestsError } from '../../../infrastructure/errors/too-many-requests-error';
import { EmailService } from '../../../infrastructure/services/email-service';
import { JwtService } from '../../../infrastructure/services/jwt-service';
import { UserOrchestrator } from '../../../application/user/user-orchestrator';

describe('UserOrchestrator', () => {
    const TEST_URL = 'http://localhost:3000';
    const TEST_JWT = 'json-web-token';
    const TEST_OBJECT_ID = new ObjectId();
    const TEST_EMAIL_FROM = 'no-reply@example.com';

    let user: User;

    let jwtService: JwtService;
    let emailService: EmailService;
    let userService: UserService;
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
        userOrchestrator = new UserOrchestrator(
            jwtService,
            emailService,
            userService,
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

        it('should throw a TooManyRequestsError before end of cooldown', () => {
            user = {
                emailVerificationCooldownExpiresAt: new Date(
                    Date.now() + 60 * 1000, // 1 minute
                ),
            } as unknown as User;

            expect(
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

        it('should call userService to setEmailVerificationCooldown', async () => {
            await userOrchestrator.sendVerificationEmail(user, TEST_URL);

            expect(
                userService.setEmailVerificationCooldown,
            ).toHaveBeenLastCalledWith(user);
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

        it('should throw a ConflictError if email is already verified', () => {
            user = {
                ...user,
                isEmailVerified: true,
            };

            (userService.findOneById as jest.Mock).mockResolvedValue(user);

            expect(userOrchestrator.verifyEmail(TEST_JWT)).rejects.toThrow(
                ConflictError,
            );
        });

        it('should call userService to markEmailAsVerified', async () => {
            await userOrchestrator.verifyEmail(TEST_JWT);

            expect(userService.markEmailAsVerified).toHaveBeenCalledWith(user);
        });
    });
});
