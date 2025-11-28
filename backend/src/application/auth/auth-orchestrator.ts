import { UserService } from '../../domain/user/user-service';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { UnauthorizedError } from '../../infrastructure/errors/unauthorized-error';
import { User } from '../../domain/user/user-types';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { RefreshTokenService } from '../../domain/refresh-token/refresh-token-service';
import { generateToken } from '../../infrastructure/utils/token';
import { TokenManager } from '../ports/token-manager';
import { Hasher } from '../ports/hasher';

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
    }: {
        email: string;
        password: string;
    }): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> => {
        const passwordHash = await this.hasher.hash(password);

        const user = await this.userService.register({ email, passwordHash });

        const token = generateToken();

        const refreshToken = await this.refreshTokenService.create({
            token,
            userId: user._id,
        });

        const accessToken = this.tokenManager.signAccess(user._id);

        return { user, accessToken, refreshToken };
    };

    login = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> => {
        const user = await this.userService
            .findOneByEmail(email)
            .catch((err) => {
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

        const token = generateToken();

        const refreshToken = await this.refreshTokenService.create({
            token,
            userId: user._id,
        });

        const accessToken = this.tokenManager.signAccess(user._id);

        return { user, accessToken, refreshToken };
    };

    refresh = async (
        token: string,
    ): Promise<{ accessToken: string; refreshToken: RefreshToken }> => {
        let refreshToken = await this.refreshTokenService
            .findOneByToken(token)
            .catch((err) => {
                if (err instanceof NotFoundError) {
                    throw new UnauthorizedError('Invalid refresh token');
                }

                throw err;
            });

        if (refreshToken.expiresAt < new Date()) {
            throw new UnauthorizedError('Expired refresh token');
        }

        const newToken = generateToken();
        refreshToken = await this.refreshTokenService.extendExpiration(
            refreshToken,
            newToken,
        );

        const accessToken = this.tokenManager.signAccess(refreshToken.userId);

        return { accessToken, refreshToken };
    };

    logout = async (token: string) => {
        return await this.refreshTokenService.findOneAndDeleteByToken(token);
    };
}
