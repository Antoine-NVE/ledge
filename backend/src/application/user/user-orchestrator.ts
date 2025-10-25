import { User } from '../../domain/user/user-types';
import { ConflictError } from '../../errors/conflict-error';
import { TooManyRequestsError } from '../../errors/too-many-requests-error';
import { objectIdSchema } from '../../schemas/security-schemas';
import { EmailService } from '../../services/email-service';
import { JwtService } from '../../services/jwt-service';
import { UserService } from '../../services/user-service';
import { parseSchema } from '../../utils/schema-utils';

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

        user.emailVerificationCooldownExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        ); // 5 minutes
        await this.userService.updateOne(user);
    };

    verifyEmail = async (jwt: string): Promise<void> => {
        const payload = this.jwtService.verifyEmailVerification(jwt);

        const userId = parseSchema(objectIdSchema, payload.sub);
        const user = await this.userService.findOneById(userId);
        if (user.isEmailVerified)
            throw new ConflictError('Email already verified');

        user.isEmailVerified = true;
        await this.userService.updateOne(user);
    };
}
