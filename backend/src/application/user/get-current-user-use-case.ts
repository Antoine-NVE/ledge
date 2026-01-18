import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/entities/user.js';
import { AuthenticationError } from '../errors/authentication.error.js';

type Input = {
    userId: string;
};

type Output = {
    user: User;
};

export class GetCurrentUserUseCase {
    constructor(private userRepository: UserRepository) {}

    execute = async ({ userId }: Input): Promise<Output> => {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new AuthenticationError();

        return { user };
    };
}
