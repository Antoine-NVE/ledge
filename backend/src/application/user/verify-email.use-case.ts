import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { TokenManager, VerifyTokenError } from '../../domain/ports/token-manager.js';
import type { User } from '../../domain/entities/user.js';
import type { Logger } from '../../domain/ports/logger.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type VerifyEmailInput = {
    emailVerificationToken: string;
};

type VerifyEmailResult = Result<
    void,
    VerifyTokenError | { type: 'USER_NOT_FOUND' } | { type: 'EMAIL_ALREADY_VERIFIED' }
>;

export class VerifyEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
    ) {}

    execute = async ({ emailVerificationToken }: VerifyEmailInput, logger: Logger): Promise<VerifyEmailResult> => {
        const verification = this.tokenManager.verifyEmailVerification(emailVerificationToken);
        if (!verification.success) return fail(verification.error);
        const { userId } = verification.data;

        const user = await this.userRepository.findById(userId);
        if (!user) return fail({ type: 'USER_NOT_FOUND' });
        if (user.isEmailVerified) return fail({ type: 'EMAIL_ALREADY_VERIFIED' });

        const updatedUser: User = {
            ...user,
            isEmailVerified: true,
            updatedAt: new Date(),
        };
        await this.userRepository.save(updatedUser);
        logger.info('User updated', { userId: user.id });

        return ok(undefined);
    };
}
