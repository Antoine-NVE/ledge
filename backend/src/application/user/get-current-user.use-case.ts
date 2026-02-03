import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/entities/user.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type GetCurrentUserInput = {
    userId: string;
};

type GetCurrentUserResult = Result<{ user: User }, { type: 'USER_NOT_FOUND' }>;

export class GetCurrentUserUseCase {
    constructor(private userRepository: UserRepository) {}

    execute = async (input: GetCurrentUserInput): Promise<GetCurrentUserResult> => {
        const user = await this.userRepository.findById(input.userId);
        if (!user) return fail({ type: 'USER_NOT_FOUND' });

        return ok({ user });
    };
}
