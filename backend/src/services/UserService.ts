import { EmailAlreadyVerifiedError } from '../errors/ConflictError';
import { UserNotFoundError } from '../errors/NotFoundError';
import { EmailVerificationCooldownError } from '../errors/TooManyRequestsError';
import { UserDocument } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { EmailService } from './EmailService';
import { JwtService } from './JwtService';

export class UserService {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userRepository: UserRepository,
    ) {}

    async sendEmailVerificationEmail(from: string, user: UserDocument, frontendBaseUrl: string): Promise<void> {
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();
        if (user.emailVerificationCooldownExpiresAt && user.emailVerificationCooldownExpiresAt > new Date())
            throw new EmailVerificationCooldownError();

        const jwt = this.jwtService.signEmailVerificationJwt(user._id);

        await this.emailService.sendEmailVerificationEmail(from, user.email, frontendBaseUrl, jwt);

        await this.setEmailVerificationCooldown(user);
    }

    async verifyEmail(token: string): Promise<void> {
        const decoded = this.jwtService.verifyEmailVerificationJwt(token);
        const user = await this.userRepository.findById(decoded.sub);

        if (!user) throw new UserNotFoundError();
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();

        await this.markEmailAsVerified(user);
    }

    async setEmailVerificationCooldown(user: UserDocument): Promise<void> {
        await this.userRepository.updateFromDocument(user, {
            emailVerificationCooldownExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
    }

    async markEmailAsVerified(user: UserDocument): Promise<void> {
        await this.userRepository.updateFromDocument(user, {
            isEmailVerified: true,
        });
    }
}
