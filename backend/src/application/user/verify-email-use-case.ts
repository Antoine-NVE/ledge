import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import { BusinessRuleError } from '../errors/business-rule.error.js';
import type { User } from '../../domain/entities/user.js';

type Input = {
    emailVerificationToken: string;
};

type Output = void;

export class VerifyEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
    ) {}

    execute = async ({ emailVerificationToken }: Input): Promise<Output> => {
        const { userId } = this.tokenManager.verifyEmailVerification(emailVerificationToken);

        const user = await this.userRepository.findById(userId);
        if (!user) throw new BusinessRuleError('INVALID_TOKEN');
        if (user.isEmailVerified) throw new BusinessRuleError('EMAIL_ALREADY_VERIFIED');

        const updatedUser: User = {
            ...user,
            isEmailVerified: true,
            updatedAt: new Date(),
        };
        await this.userRepository.save(updatedUser);
    };
}
