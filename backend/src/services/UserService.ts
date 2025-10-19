import {
    EmailAlreadyExistsError,
    EmailAlreadyVerifiedError,
} from '../errors/ConflictError';
import { UserNotFoundError } from '../errors/NotFoundError';
import { EmailVerificationCooldownError } from '../errors/TooManyRequestsError';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../types/User';
import { EmailService } from './EmailService';
import { JwtService } from './JwtService';
import { MongoServerError, ObjectId } from 'mongodb';
import { parseSchema } from '../utils/schema';
import { objectIdSchema } from '../schemas/security';
import { userSchema } from '../schemas/user';

export class UserService {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userRepository: UserRepository,
    ) {}

    sendVerificationEmail = async (
        user: User,
        frontendBaseUrl: string,
    ): Promise<void> => {
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();
        if (
            user.emailVerificationCooldownExpiresAt &&
            user.emailVerificationCooldownExpiresAt > new Date()
        )
            throw new EmailVerificationCooldownError();

        const jwt = this.jwtService.signEmailVerification(user._id);

        await this.emailService.sendVerification(
            user.email,
            frontendBaseUrl,
            jwt,
        );

        user.emailVerificationCooldownExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        ); // 5 minutes
        await this.updateOne(user);
    };

    verifyEmail = async (jwt: string): Promise<void> => {
        const payload = this.jwtService.verifyEmailVerification(jwt);

        const userId = parseSchema(objectIdSchema, payload.sub);
        const user = await this.findOneById(userId);
        if (user.isEmailVerified) throw new EmailAlreadyVerifiedError();

        user.isEmailVerified = true;
        await this.updateOne(user);
    };

    insertOne = async (email: string, passwordHash: string): Promise<User> => {
        const user = parseSchema(userSchema, {
            _id: new ObjectId(),
            email,
            passwordHash,
            isEmailVerified: false,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date(),
            updatedAt: null,
        });

        await this.userRepository.insertOne(user).catch((err) => {
            if (err instanceof MongoServerError && err.code === 11000) {
                throw new EmailAlreadyExistsError();
            }
            throw err;
        });

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

        user = parseSchema(userSchema, user);

        await this.userRepository.updateOne(user);

        return user;
    };

    removePasswordHash = (user: User): Omit<User, 'passwordHash'> => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...safeUser } = user;

        return safeUser;
    };
}
