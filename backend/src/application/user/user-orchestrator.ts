import { User } from '../../domain/user/user-types';
import { ConflictError } from '../../infrastructure/errors/conflict-error';
import { TooManyRequestsError } from '../../infrastructure/errors/too-many-requests-error';
import { UserService } from '../../domain/user/user-service';
import { TokenManager } from '../ports/token-manager';
import { EmailSender } from '../ports/email-sender';
import { CacheStore } from '../ports/cache-store';

export class UserOrchestrator {
    constructor(
        private tokenManager: TokenManager,
        private emailSender: EmailSender,
        private userService: UserService,
        private cacheStore: CacheStore,
        private emailFrom: string,
    ) {}

    sendVerificationEmail = async (
        user: User,
        frontendBaseUrl: string,
    ): Promise<void> => {
        if (user.isEmailVerified) {
            throw new ConflictError('Email already verified');
        }

        if (await this.cacheStore.existsVerificationEmailCooldown(user._id)) {
            throw new TooManyRequestsError(
                'Please wait before requesting another verification email',
            );
        }

        const token = this.tokenManager.signVerificationEmail(user._id);

        await this.emailSender.sendVerification(
            { from: this.emailFrom, to: user.email },
            frontendBaseUrl,
            token,
        );

        await this.cacheStore.setVerificationEmailCooldown(user._id);
    };

    verifyEmail = async (token: string): Promise<User> => {
        const userId = this.tokenManager.verifyVerificationEmail(token);
        const user = await this.userService.findOneById(userId);
        if (user.isEmailVerified) {
            throw new ConflictError('Email already verified');
        }

        await this.userService.markEmailAsVerified(user);

        return user;
    };
}
