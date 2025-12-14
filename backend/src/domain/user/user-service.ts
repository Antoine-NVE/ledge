import { UserRepository } from './user-repository';
import { NewUser, User } from './user-types';
import { NotFoundError } from '../../core/errors/not-found-error';

type RegisterInput = {
    email: string;
    passwordHash: string;
};

type FindByIdInput = {
    id: string;
};

type FindByEmailInput = {
    email: string;
};

type MarkEmailAsVerifiedInput = {
    user: User;
};

export class UserService {
    constructor(private userRepository: UserRepository) {}

    register = async (data: RegisterInput) => {
        const newUser: NewUser = {
            ...data,
            isEmailVerified: false,
            createdAt: new Date(),
        };

        return await this.userRepository.create(newUser);
    };

    findById = async ({ id }: FindByIdInput) => {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundError({ message: 'User not found' });
        return user;
    };

    findByEmail = async ({ email }: FindByEmailInput) => {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError({ message: 'User not found' });
        return user;
    };

    markEmailAsVerified = async ({ user }: MarkEmailAsVerifiedInput) => {
        user.isEmailVerified = true;
        user.updatedAt = new Date();

        await this.userRepository.save(user);
        return user;
    };
}
