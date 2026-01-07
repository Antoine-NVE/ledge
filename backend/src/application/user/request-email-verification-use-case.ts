import type { EmailSender } from '../ports/email-sender.js';
import type { UserRepository } from '../../domain/user/user-repository.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { CacheStore } from '../ports/cache-store.js';
import { fail, ok } from '../../core/utils/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import { TooManyRequestsError } from '../../core/errors/too-many-requests-error.js';
import { ConflictError } from '../../core/errors/conflict-error.js';
import type { Result } from '../../core/types/result.js';

type Input = {
    userId: string;
    frontendBaseUrl: string;
};

type Output = void;

export class RequestEmailVerificationUseCase {
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
        const user = result.data;

        if (!user) return fail(new UnauthorizedError({ action: 'LOGIN' }));
        if (user.isEmailVerified) return fail(new ConflictError({ message: 'Email already verified' }));

        const hasCooldownResult = await this.cacheStore.hasEmailVerificationCooldown(user.id);
        if (!hasCooldownResult.success) return fail(hasCooldownResult.error);
        const hasCooldown = hasCooldownResult.data;

        if (hasCooldown)
            return fail(
                new TooManyRequestsError({ message: 'Please wait before requesting another email verification' }),
            );

        const emailResult = await this.emailSender.sendEmailVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl,
            emailVerificationToken: await this.tokenManager.signEmailVerification({ userId }),
        });
        if (!emailResult.success) return fail(emailResult.error);

        const setCooldownResult = await this.cacheStore.setEmailVerificationCooldown(user.id);
        if (!setCooldownResult.success) return fail(setCooldownResult.error);

        return ok(undefined);
    };
}
