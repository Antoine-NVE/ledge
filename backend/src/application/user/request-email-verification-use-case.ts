import type { EmailSender } from '../ports/email-sender.js';
import type { UserRepository } from '../../domain/user/user-repository.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { CacheStore } from '../ports/cache-store.js';
import { AuthenticationError } from '../errors/authentication.error.js';
import { BusinessRuleError } from '../errors/business-rule.error.js';

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

    execute = async ({ userId, frontendBaseUrl }: Input): Promise<Output> => {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new AuthenticationError();
        if (user.isEmailVerified) throw new BusinessRuleError('EMAIL_ALREADY_VERIFIED');

        const activeCooldown = await this.cacheStore.hasEmailVerificationCooldown(user.id);
        if (activeCooldown) throw new BusinessRuleError('ACTIVE_COOLDOWN');

        await this.emailSender.sendEmailVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl,
            emailVerificationToken: this.tokenManager.signEmailVerification({ userId }),
        });

        await this.cacheStore.setEmailVerificationCooldown(user.id);
    };
}
