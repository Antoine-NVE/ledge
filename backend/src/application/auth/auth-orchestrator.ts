import { UserService } from '../../domain/user/user-service';
import { User } from '../../domain/user/user-types';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { RefreshTokenService } from '../../domain/refresh-token/refresh-token-service';
import { generateToken } from '../../infrastructure/utils/token';
import { TokenManager } from '../ports/token-manager';
import { Hasher } from '../ports/hasher';
import { NotFoundError } from '../../core/errors/not-found-error';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';

type RegisterInput = {
    email: string;
    password: string;
};

type RegisterOutput = {
    user: User;
    accessToken: string;
    refreshToken: RefreshToken;
};

type LoginInput = {
    email: string;
    password: string;
};

type LoginOutput = {
    user: User;
    accessToken: string;
    refreshToken: RefreshToken;
};

type RefreshInput = {
    token: string;
};

type RefreshOutput = {
    accessToken: string;
    refreshToken: RefreshToken;
};

type LogoutInput = {
    token: string;
};

type LogoutOutput = {
    refreshToken: RefreshToken;
};

export class AuthOrchestrator {
    constructor(
        private userService: UserService,
        private tokenManager: TokenManager,
        private refreshTokenService: RefreshTokenService,
        private hasher: Hasher,
    ) {}

    register = async ({
        email,
        password,
    }: RegisterInput): Promise<RegisterOutput> => {
        const passwordHash = await this.hasher.hash(password);

        const user = await this.userService.register({ email, passwordHash });

        const refreshToken = await this.refreshTokenService.create({
            token: generateToken(),
            userId: user.id,
        });

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return { user, accessToken, refreshToken };
    };

    login = async ({ email, password }: LoginInput): Promise<LoginOutput> => {
        const user = await this.userService
            .findByEmail({ email })
            .catch((err: unknown) => {
                if (err instanceof NotFoundError) {
                    throw new UnauthorizedError('Invalid credentials');
                }
                throw err;
            });

        const doesMatch = await this.hasher.compare(
            password,
            user.passwordHash,
        );
        if (!doesMatch) throw new UnauthorizedError('Invalid credentials');

        const refreshToken = await this.refreshTokenService.create({
            token: generateToken(),
            userId: user.id,
        });

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return { user, accessToken, refreshToken };
    };

    refresh = async ({ token }: RefreshInput): Promise<RefreshOutput> => {
        let refreshToken = await this.refreshTokenService
            .findByToken({ token })
            .catch((err: unknown) => {
                if (err instanceof NotFoundError) {
                    throw new UnauthorizedError('Invalid refresh token');
                }
                throw err;
            });

        if (refreshToken.expiresAt < new Date()) {
            throw new UnauthorizedError('Expired refresh token');
        }

        refreshToken = await this.refreshTokenService.rotateToken({
            refreshToken,
            token: generateToken(),
        });

        const accessToken = this.tokenManager.signAccess({
            userId: refreshToken.userId,
        });

        return { accessToken, refreshToken };
    };

    logout = async ({ token }: LogoutInput): Promise<LogoutOutput> => {
        const refreshToken = await this.refreshTokenService.deleteByToken({
            token,
        });
        return { refreshToken };
    };
}
