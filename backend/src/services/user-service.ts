import { UserRepository } from '../repositories/user-repository';
import { User } from '../types/user-type';
import { EmailService } from './email-service';
import { JwtService } from './jwt-service';
import { MongoServerError, ObjectId } from 'mongodb';
import { parseSchema } from '../utils/schema-utils';
import { objectIdSchema } from '../schemas/security-schemas';
import { userSchema } from '../schemas/user-schemas';
import { ConflictError } from '../errors/conflict-error';
import { TooManyRequestsError } from '../errors/too-many-requests-error';
import { NotFoundError } from '../errors/not-found-error';

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
        await this.updateOne(user);
    };

    verifyEmail = async (jwt: string): Promise<void> => {
        const payload = this.jwtService.verifyEmailVerification(jwt);

        const userId = parseSchema(objectIdSchema, payload.sub);
        const user = await this.findOneById(userId);
        if (user.isEmailVerified)
            throw new ConflictError('Email already verified');

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
                throw new ConflictError('Email already exists');
            }
            throw err;
        });

        return user;
    };

    findOneById = async (id: ObjectId): Promise<User> => {
        const user = await this.userRepository.findOne('_id', id);
        if (!user) throw new NotFoundError('User not found');

        return user;
    };

    findOneByEmail = async (email: string): Promise<User> => {
        const user = await this.userRepository.findOne('email', email);
        if (!user) throw new NotFoundError('User not found');

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
