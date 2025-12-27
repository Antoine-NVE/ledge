import { UserRepository } from '../../domain/user/user-repository';
import { TokenManager } from '../ports/token-manager';
import { User } from '../../domain/user/user-types';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';

type Input = {
    token: string;
};

type Output = {
    user: User;
};

export class VerifyEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
    ) {}

    execute = async ({
        token,
    }: Input): Promise<Result<Output, ConflictError | Error | NotFoundError | UnauthorizedError>> => {
        const tokenResult = this.tokenManager.verifyVerificationEmail(token);
        if (!tokenResult.success) return fail(tokenResult.error);
        const { userId } = tokenResult.value;

        const findResult = await this.userRepository.findById(userId);
        if (!findResult.success) return fail(findResult.error);
        const user = findResult.value;
        if (!user) return fail(new UnauthorizedError({ message: 'User not found for this token' }));
        if (user.isEmailVerified) return fail(new ConflictError({ message: 'Email already verified' }));

        user.isEmailVerified = true;
        user.updatedAt = new Date();
        const saveResult = await this.userRepository.save(user);
        if (!saveResult.success) return fail(saveResult.error);

        return ok({ user });
    };
}
