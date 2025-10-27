import { User } from '../../domain/user/user-types';
import { ConflictError } from '../../infrastructure/errors/conflict-error';
import { TooManyRequestsError } from '../../infrastructure/errors/too-many-requests-error';
import { UserService } from '../../domain/user/user-service';
import { JwtService } from '../../infrastructure/services/jwt-service';
import { EmailService } from '../../infrastructure/services/email-service';

export class UserOrchestrator {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userService: UserService,
    ) {}

    sendVerificationEmail = async (
        user: User,
        frontendBaseUrl: string,
    ): Promise<void> => {
        if (user.isEmailVerified)
            throw new ConflictError('Email already verified');
        if (
            user.emailVerificationCooldownExpiresAt &&
            user.emailVerificationCooldownExpiresAt > new Date()
        )
            throw new TooManyRequestsError(
                'Please wait before requesting another verification email',
            );

        const jwt = this.jwtService.signEmailVerification(user._id);

        await this.emailService.sendVerification(
            user.email,
            frontendBaseUrl,
            jwt,
        );

        await this.userService.setEmailVerificationCooldown(user);
    };

    verifyEmail = async (jwt: string): Promise<void> => {
        const { sub } = this.jwtService.verifyEmailVerification(jwt);
        const user = await this.userService.findOneById(sub);
        if (user.isEmailVerified)
            throw new ConflictError('Email already verified');

        await this.userService.markEmailAsVerified(user);
    };
}
