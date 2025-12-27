import { UserRepository } from '../../domain/user/user-repository';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { Hasher } from '../ports/hasher';
import { TokenManager } from '../ports/token-manager';
import { IdGenerator } from '../ports/id-generator';
import { User } from '../../domain/user/user-types';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';
import { generateToken } from '../../core/utils/token';
import { ConflictError } from '../../core/errors/conflict-error';

type Input = {
    email: string;
    password: string;
};

type Output = {
    user: User;
    accessToken: string;
    refreshToken: RefreshToken;
};

export class RegisterUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepository: RefreshTokenRepository,
        private hasher: Hasher,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
    ) {}

    execute = async ({ email, password }: Input): Promise<Result<Output, ConflictError | Error>> => {
        const now = new Date();

        const user: User = {
            id: this.idGenerator.generate(),
            email,
            passwordHash: await this.hasher.hash(password),
            isEmailVerified: false,
            createdAt: now,
            updatedAt: now,
        };
        const userResult = await this.userRepository.create(user);
        if (!userResult.success) return fail(userResult.error);

        const refreshToken: RefreshToken = {
            id: this.idGenerator.generate(),
            userId: user.id,
            value: generateToken(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
            updatedAt: now,
        };
        const refreshTokenResult = await this.refreshTokenRepository.create(refreshToken);
        if (!refreshTokenResult.success) return fail(refreshTokenResult.error);

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken });
    };
}
