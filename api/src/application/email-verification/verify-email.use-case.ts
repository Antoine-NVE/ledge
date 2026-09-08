import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { EmailVerificationRepository } from '../../domain/repositories/email-verification.repository.js';

export class VerifyEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailVerificationRepository: EmailVerificationRepository,
    ) {}

    execute = async (token: string) => {
        const now = new Date();

        const emailVerification = await this.emailVerificationRepository.findByToken(token);
        if (!emailVerification) return { success: false, code: 'EMAIL_VERIFICATION_NOT_FOUND' } as const;
        if (emailVerification.expiresAt < now) return { success: false, code: 'TOKEN_EXPIRED' } as const;

        const user = await this.userRepository.findById(emailVerification.userId);
        if (!user) return { success: false, code: 'USER_NOT_FOUND' } as const;
        if (user.isEmailVerified) return { success: false, code: 'EMAIL_ALREADY_VERIFIED' } as const;

        await this.userRepository.save(user.verifyEmail());

        await this.emailVerificationRepository.delete(emailVerification);

        return { success: true, data: emailVerification } as const;
    };
}
