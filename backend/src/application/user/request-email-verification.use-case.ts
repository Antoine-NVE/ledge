import type { EmailSender } from '../../domain/ports/email-sender.js';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { CacheStore } from '../../domain/ports/cache-store.js';
import { fail, ok, type Result } from '../../core/result.js';

type RequestEmailVerificationInput = {
    userId: string;
    frontendBaseUrl: string;
};

type RequestEmailVerificationResult = Result<void, 'USER_NOT_FOUND' | 'EMAIL_ALREADY_VERIFIED' | 'ACTIVE_COOLDOWN'>;

export class RequestEmailVerificationUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailSender: EmailSender,
        private tokenManager: TokenManager,
        private cacheStore: CacheStore,
        private emailFrom: string,
    ) {}

    execute = async (input: RequestEmailVerificationInput): Promise<RequestEmailVerificationResult> => {
        const user = await this.userRepository.findById(input.userId);
        if (!user) return fail('USER_NOT_FOUND');
        if (user.isEmailVerified) return fail('EMAIL_ALREADY_VERIFIED');

        const activeCooldown = await this.cacheStore.hasEmailVerificationCooldown(user.id);
        if (activeCooldown) return fail('ACTIVE_COOLDOWN');

        await this.emailSender.sendEmailVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl: input.frontendBaseUrl,
            emailVerificationToken: this.tokenManager.signEmailVerification({ userId: user.id }),
        });

        await this.cacheStore.setEmailVerificationCooldown(user.id);

        return ok(undefined);
    };
}
