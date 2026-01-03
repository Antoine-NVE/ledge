import type { UserRepository } from '../../domain/user/user-repository.js';
import type { Result } from '../../core/types/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import { fail, ok } from '../../core/utils/result.js';
import type { User } from '../../domain/user/user-types.js';

type Input = {
    userId: string;
};

type Output = {
    user: User;
};

export class GetCurrentUserUseCase {
    constructor(private userRepository: UserRepository) {}

    execute = async ({ userId }: Input): Promise<Result<Output, Error | UnauthorizedError>> => {
        const result = await this.userRepository.findById(userId);
        if (!result.success) return fail(result.error);
        const user = result.data;
        if (!user) return fail(new UnauthorizedError({ action: 'LOGIN' }));

        return ok({ user });
    };
}
