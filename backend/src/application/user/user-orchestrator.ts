import { User } from '../../domain/user/user-types';
import { TokenManager } from '../ports/token-manager';
import { EmailSender } from '../ports/email-sender';
import { CacheStore } from '../ports/cache-store';
import { ConflictError } from '../../core/errors/conflict-error';
import { TooManyRequestsError } from '../../core/errors/too-many-requests-error';
import { UserRepository } from '../../domain/user/user-repository';
import { fail, ok, Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

type SendVerificationEmailInput = {
    user: User;
    frontendBaseUrl: string;
};

type SendVerificationEmailOutput = void;

type VerifyEmailInput = {
    token: string;
};

type VerifyEmailOutput = {
    user: User;
};

export class UserOrchestrator {
    constructor(
        private tokenManager: TokenManager,
        private emailSender: EmailSender,
        private userRepository: UserRepository,
        private cacheStore: CacheStore,
        private emailFrom: string,
    ) {}

    sendVerificationEmail = async ({
        user,
        frontendBaseUrl,
    }: SendVerificationEmailInput): Promise<
        Result<SendVerificationEmailOutput, ConflictError | TooManyRequestsError>
    > => {
        if (user.isEmailVerified) {
            return fail(new ConflictError({ message: 'Email already verified' }));
        }

        if (await this.cacheStore.existsVerificationEmailCooldown(user.id)) {
            return fail(
                new TooManyRequestsError({ message: 'Please wait before requesting another verification email' }),
            );
        }

        const token = this.tokenManager.signVerificationEmail({
            userId: user.id,
        });

        await this.emailSender.sendVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl,
            token,
        });

        await this.cacheStore.setVerificationEmailCooldown(user.id);

        return ok(undefined);
    };

    verifyEmail = async ({
        token,
    }: VerifyEmailInput): Promise<Result<VerifyEmailOutput, ConflictError | Error | NotFoundError>> => {
        const { userId } = this.tokenManager.verifyVerificationEmail(token);

        const result = await this.userRepository.findById(userId);
        if (!result.success) return fail(result.error);
        const user = result.value;

        if (user.isEmailVerified) {
            return fail(new ConflictError({ message: 'Email already verified' }));
        }

        user.isEmailVerified = true;
        user.updatedAt = new Date();
        await this.userRepository.save(user);

        return ok({ user });
    };
}
