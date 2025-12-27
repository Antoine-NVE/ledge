import { EmailSender } from '../ports/email-sender';
import { UserRepository } from '../../domain/user/user-repository';
import { TokenManager } from '../ports/token-manager';
import { CacheStore } from '../ports/cache-store';
import { fail, ok } from '../../core/utils/result';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { TooManyRequestsError } from '../../core/errors/too-many-requests-error';
import { ConflictError } from '../../core/errors/conflict-error';
import { Result } from '../../core/types/result';
import { User } from '../../domain/user/user-types';

type Input = {
    userId: string;
    frontendBaseUrl: string;
};

type Output = {
    user: User;
};

export class SendVerificationEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailSender: EmailSender,
        private tokenManager: TokenManager,
        private cacheStore: CacheStore,
        private emailFrom: string,
    ) {}

    execute = async ({
        userId,
        frontendBaseUrl,
    }: Input): Promise<Result<Output, ConflictError | Error | TooManyRequestsError | UnauthorizedError>> => {
        const result = await this.userRepository.findById(userId);
        if (!result.success) return fail(result.error);
        const user = result.value;
        if (!user) return fail(new UnauthorizedError());
        if (user.isEmailVerified) return fail(new ConflictError({ message: 'Email already verified' }));

        const cooldownExistsResult = await this.cacheStore.existsVerificationEmailCooldown(user.id);
        if (!cooldownExistsResult.success) return fail(cooldownExistsResult.error);
        const exists = cooldownExistsResult.value;
        if (exists) {
            return fail(
                new TooManyRequestsError({ message: 'Please wait before requesting another verification email' }),
            );
        }

        const token = this.tokenManager.signVerificationEmail({ userId });

        await this.emailSender.sendVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl,
            token,
        });

        const cooldownSetResult = await this.cacheStore.setVerificationEmailCooldown(user.id);
        if (!cooldownSetResult.success) return fail(cooldownSetResult.error);

        return ok({ user });
    };
}
