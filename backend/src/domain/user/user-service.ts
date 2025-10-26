import { UserRepository } from './user-repository';
import { MongoServerError, ObjectId } from 'mongodb';
import { ConflictError } from '../../infrastructure/errors/conflict-error';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { User } from './user-types';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    register = async (email: string, passwordHash: string): Promise<User> => {
        const user: User = {
            _id: new ObjectId(),
            email,
            passwordHash,
            isEmailVerified: false,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date(),
            updatedAt: null,
        };

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

    setEmailVerificationCooldown = async (user: User): Promise<User> => {
        user.updatedAt = new Date();

        user.emailVerificationCooldownExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        ); // 5 minutes

        await this.userRepository.updateOne(user);

        return user;
    };

    markEmailAsVerified = async (user: User): Promise<User> => {
        user.updatedAt = new Date();

        user.isEmailVerified = true;

        await this.userRepository.updateOne(user);

        return user;
    };
}
