import type { EmailSender } from '../ports/email-sender.js';
import type { UserRepository } from '../../domain/user/user-repository.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { CacheStore } from '../ports/cache-store.js';
import { fail, ok } from '../../core/utils/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import { TooManyRequestsError } from '../../core/errors/too-many-requests-error.js';
import { ConflictError } from '../../core/errors/conflict-error.js';
import type { Result } from '../../core/types/result.js';
import type { User } from '../../domain/user/user-types.js';

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
        const cooldownExists = cooldownExistsResult.value;
        if (cooldownExists) {
            return fail(
                new TooManyRequestsError({ message: 'Please wait before requesting another verification email' }),
            );
        }

        const emailResult = await this.emailSender.sendVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl,
            token: await this.tokenManager.signVerificationEmail({ userId }),
        });
        if (!emailResult.success) return fail(emailResult.error);

        const cooldownSetResult = await this.cacheStore.setVerificationEmailCooldown(user.id);
        if (!cooldownSetResult.success) return fail(cooldownSetResult.error);

        return ok({ user });
    };
}
