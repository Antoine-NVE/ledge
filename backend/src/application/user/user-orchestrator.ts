import { User } from '../../domain/user/user-types';
import { ConflictError } from '../../infrastructure/errors/conflict-error';
import { TooManyRequestsError } from '../../infrastructure/errors/too-many-requests-error';
import { UserService } from '../../domain/user/user-service';
import { JwtService } from '../../infrastructure/services/jwt-service';
import { EmailService } from '../../infrastructure/services/email-service';
import { CacheService } from '../../infrastructure/services/cache-service';
import { Env } from '../../infrastructure/types/env-type';

export class UserOrchestrator {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userService: UserService,
        private cacheService: CacheService,
        private env: Env,
    ) {}

    sendVerificationEmail = async (
        user: User,
        frontendBaseUrl: string,
    ): Promise<void> => {
        if (user.isEmailVerified) {
            throw new ConflictError('Email already verified');
        }

        if (await this.cacheService.existsVerificationEmailCooldown(user._id)) {
            throw new TooManyRequestsError(
                'Please wait before requesting another verification email',
            );
        }

        const jwt = this.jwtService.signVerificationEmail(user._id);

        await this.emailService.sendVerification(
            this.env.EMAIL_FROM,
            user.email,
            frontendBaseUrl,
            jwt,
        );

        await this.cacheService.setVerificationEmailCooldown(user._id);
    };

    verifyEmail = async (jwt: string): Promise<void> => {
        const { sub } = this.jwtService.verifyVerificationEmail(jwt);
        const user = await this.userService.findOneById(sub);
        if (user.isEmailVerified) {
            throw new ConflictError('Email already verified');
        }

        await this.userService.markEmailAsVerified(user);
    };
}
