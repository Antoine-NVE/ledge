import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { TokenManager, VerifyTokenError } from '../../domain/ports/token-manager.js';
import type { User } from '../../domain/entities/user.js';
import type { Logger } from '../../domain/ports/logger.js';
import { fail, ok, type Result } from '../../core/result.js';

type VerifyEmailInput = {
    emailVerificationToken: string;
};

type VerifyEmailResult = Result<void, VerifyTokenError | 'USER_NOT_FOUND' | 'EMAIL_ALREADY_VERIFIED'>;

export class VerifyEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
    ) {}

    execute = async (input: VerifyEmailInput, logger: Logger): Promise<VerifyEmailResult> => {
        const verification = this.tokenManager.verifyEmailVerification(input.emailVerificationToken);
        if (!verification.success) return fail(verification.error);
        const { userId } = verification.data;

        const user = await this.userRepository.findById(userId);
        if (!user) return fail('USER_NOT_FOUND');
        if (user.isEmailVerified) return fail('EMAIL_ALREADY_VERIFIED');

        const updatedUser: User = {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            isEmailVerified: true,
            createdAt: user.createdAt,
            updatedAt: new Date(),
        };
        await this.userRepository.save(updatedUser);
        logger.info('User updated', { userId: user.id });

        return ok(undefined);
    };
}
