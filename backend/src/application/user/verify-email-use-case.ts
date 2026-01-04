import type { UserRepository } from '../../domain/user/user-repository.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import { ConflictError } from '../../core/errors/conflict-error.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';

type Input = {
    emailVerificationToken: string;
};

type Output = void;

export class VerifyEmailUseCase {
    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
    ) {}

    execute = async ({
        emailVerificationToken,
    }: Input): Promise<Result<Output, ConflictError | Error | NotFoundError | UnauthorizedError>> => {
        const tokenResult = this.tokenManager.verifyEmailVerification(emailVerificationToken);
        if (!tokenResult.success) return fail(tokenResult.error);
        const { userId } = tokenResult.data;

        const findResult = await this.userRepository.findById(userId);
        if (!findResult.success) return fail(findResult.error);
        const user = findResult.data;
        if (!user) return fail(new UnauthorizedError({ message: 'User not found for this token' }));
        if (user.isEmailVerified) return fail(new ConflictError({ message: 'Email already verified' }));

        user.isEmailVerified = true;
        user.updatedAt = new Date();
        const saveResult = await this.userRepository.save(user);
        if (!saveResult.success) return fail(saveResult.error);

        return ok(undefined);
    };
}
