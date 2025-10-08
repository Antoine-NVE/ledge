import { EmailAlreadyVerifiedError } from '../errors/ConflictError';
import { UserNotFoundError } from '../errors/NotFoundError';
import { EmailVerificationCooldownError } from '../errors/TooManyRequestsError';
import { UserRepository } from '../repositories/UserRepository';
import { partialUserDataSchema } from '../schemas/userSchema';
import { User } from '../types/userType';
import { EmailService } from './EmailService';
import { JwtService } from './JwtService';
import { ObjectId } from 'mongodb';

export class UserService {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userRepository: UserRepository,
    ) {}

    sendEmailVerificationEmail = async (user: User, frontendBaseUrl: string): Promise<void> => {
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();
        if (
            user.emailVerificationCooldownExpiresAt &&
            user.emailVerificationCooldownExpiresAt > new Date()
        )
            throw new EmailVerificationCooldownError();

        const jwt = this.jwtService.signEmailVerificationJwt(user._id);

        await this.emailService.sendEmailVerificationEmail(user.email, frontendBaseUrl, jwt);

        const partialUserData = partialUserDataSchema.parse({
            emailVerificationCooldownExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
        await this.userRepository.updateOne(user._id, partialUserData);
    };

    verifyEmail = async (token: string): Promise<void> => {
        const decoded = this.jwtService.verifyEmailVerificationJwt(token);

        const user = await this.findOneById(new ObjectId(decoded.sub));
        if (!user) throw new UserNotFoundError();
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();

        const partialUserData = partialUserDataSchema.parse({
            isEmailVerified: true,
        });
        await this.userRepository.updateOne(user._id, partialUserData);
    };

    findOneById = async (id: ObjectId): Promise<User | null> => {
        return await this.userRepository.findOne('_id', id);
    };

    findOneByEmail = async (email: string): Promise<User | null> => {
        return await this.userRepository.findOne('email', email);
    };
}
