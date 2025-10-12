import { EmailAlreadyVerifiedError } from '../errors/ConflictError';
import { InvalidDataError } from '../errors/InternalServerError';
import { UserNotFoundError } from '../errors/NotFoundError';
import { EmailVerificationCooldownError } from '../errors/TooManyRequestsError';
import { UserRepository } from '../repositories/UserRepository';
import { UserSchema } from '../schemas/UserSchema';
import { User } from '../types/User';
import { EmailService } from './EmailService';
import { JwtService } from './JwtService';
import { ObjectId } from 'mongodb';

export class UserService {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userRepository: UserRepository,
        private userSchema: UserSchema,
    ) {}

    sendVerificationEmail = async (user: User, frontendBaseUrl: string): Promise<void> => {
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();
        if (
            user.emailVerificationCooldownExpiresAt &&
            user.emailVerificationCooldownExpiresAt > new Date()
        )
            throw new EmailVerificationCooldownError();

        const jwt = this.jwtService.signEmailVerification(user._id);

        await this.emailService.sendVerification(user.email, frontendBaseUrl, jwt);

        user.emailVerificationCooldownExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        await this.updateOne(user);
    };

    verifyEmail = async (token: string): Promise<void> => {
        const payload = this.jwtService.verifyEmailVerification(token);

        const user = await this.findOneById(new ObjectId(payload.sub));
        if (!user) throw new UserNotFoundError();
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();

        user.isEmailVerified = true;
        await this.updateOne(user);
    };

    insertOne = async (email: string, passwordHash: string): Promise<User> => {
        const { success, data, error } = this.userSchema.base.safeParse({
            _id: new ObjectId(),
            email,
            passwordHash,
            isEmailVerified: false,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date(),
            updatedAt: null,
        });
        if (!success) throw new InvalidDataError(error);
        const user = data;

        await this.userRepository.insertOne(user);

        return user;
    };

    findOneById = async (id: ObjectId): Promise<User> => {
        const user = await this.userRepository.findOne('_id', id);
        if (!user) throw new UserNotFoundError();

        return user;
    };

    findOneByEmail = async (email: string): Promise<User> => {
        const user = await this.userRepository.findOne('email', email);
        if (!user) throw new UserNotFoundError();

        return user;
    };

    updateOne = async (user: User): Promise<User> => {
        user.updatedAt = new Date();

        const { success, data, error } = this.userSchema.base.safeParse(user);
        if (!success) throw new InvalidDataError(error);
        user = data;

        await this.userRepository.updateOne(user);

        return user;
    };
}
