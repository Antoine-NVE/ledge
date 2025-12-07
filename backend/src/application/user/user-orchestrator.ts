import { User } from '../../domain/user/user-types';
import { UserService } from '../../domain/user/user-service';
import { TokenManager } from '../ports/token-manager';
import { EmailSender } from '../ports/email-sender';
import { CacheStore } from '../ports/cache-store';
import { ConflictError } from '../../core/errors/conflict-error';
import { TooManyRequestsError } from '../../core/errors/too-many-requests-error';

type SendVerificationEmailInput = {
    user: User;
    frontendBaseUrl: string;
};

type SendVerificationEmailOutput = void;

type VerifyEmailInput = {
    token: string;
};

type VerifyEmailOutput = {
    user: User;
};

export class UserOrchestrator {
    constructor(
        private tokenManager: TokenManager,
        private emailSender: EmailSender,
        private userService: UserService,
        private cacheStore: CacheStore,
        private emailFrom: string,
    ) {}

    sendVerificationEmail = async ({
        user,
        frontendBaseUrl,
    }: SendVerificationEmailInput): Promise<SendVerificationEmailOutput> => {
        if (user.isEmailVerified) {
            throw new ConflictError('Email already verified');
        }

        if (await this.cacheStore.existsVerificationEmailCooldown(user.id)) {
            throw new TooManyRequestsError(
                'Please wait before requesting another verification email',
            );
        }

        const token = this.tokenManager.signVerificationEmail({
            userId: user.id,
        });

        await this.emailSender.sendVerification({
            from: this.emailFrom,
            to: user.email,
            frontendBaseUrl,
            token,
        });

        await this.cacheStore.setVerificationEmailCooldown(user.id);
    };

    verifyEmail = async ({
        token,
    }: VerifyEmailInput): Promise<VerifyEmailOutput> => {
        const { userId } = this.tokenManager.verifyVerificationEmail(token);
        const user = await this.userService.findById({ id: userId });
        if (user.isEmailVerified) {
            throw new ConflictError('Email already verified');
        }

        await this.userService.markEmailAsVerified({ user });

        return { user };
    };
}
