import { UserRepository } from './user-repository';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { NewUser, User } from './user-types';

type RegisterUserInput = {
    email: string;
    passwordHash: string;
};

export class UserService {
    constructor(private userRepository: UserRepository) {}

    register = async (data: RegisterUserInput): Promise<User> => {
        const newUser: NewUser = {
            ...data,
            isEmailVerified: false,
            createdAt: new Date(),
        };

        return await this.userRepository.create(newUser);
    };

    findById = async (id: string): Promise<User> => {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundError('User not found');
        return user;
    };

    findByEmail = async (email: string): Promise<User> => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError('User not found');
        return user;
    };

    markEmailAsVerified = async (user: User): Promise<User> => {
        user.isEmailVerified = true;
        user.updatedAt = new Date();

        await this.userRepository.save(user);
        return user;
    };
}
