import { UserService } from '../../domain/user/user-service';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { UnauthorizedError } from '../../infrastructure/errors/unauthorized-error';
import { User } from '../../domain/user/user-types';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { RefreshTokenService } from '../../domain/refresh-token/refresh-token-service';
import { JwtService } from '../../infrastructure/services/jwt-service';
import { PasswordService } from '../../infrastructure/services/password-service';
import { TokenService } from '../../infrastructure/services/token-service';
import { LoginInput, RegisterInput } from './auth-types';

export class AuthOrchestrator {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
        private passwordService: PasswordService,
        private tokenService: TokenService,
    ) {}

    register = async ({
        email,
        password,
    }: RegisterInput): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> => {
        const passwordHash = await this.passwordService.hash(password);

        const user = await this.userService.register({ email, passwordHash });

        const token = this.tokenService.generate();

        const refreshToken = await this.refreshTokenService.create({
            token,
            userId: user._id,
        });

        const accessToken = this.jwtService.signAccess(user._id);

        return { user, accessToken, refreshToken };
    };

    login = async ({
        email,
        password,
    }: LoginInput): Promise<{
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

        const doesMatch = await this.passwordService.compare(
            password,
            user.passwordHash,
        );
        if (!doesMatch) throw new UnauthorizedError('Invalid credentials');

        const token = this.tokenService.generate();

        const refreshToken = await this.refreshTokenService.create({
            token,
            userId: user._id,
        });

        const accessToken = this.jwtService.signAccess(user._id);

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

        const newToken = this.tokenService.generate();
        refreshToken = await this.refreshTokenService.extendExpiration(
            refreshToken,
            newToken,
        );

        const accessToken = this.jwtService.signAccess(refreshToken.userId);

        return { accessToken, refreshToken };
    };

    logout = async (token: string): Promise<void> => {
        await this.refreshTokenService.deleteOneByToken(token);
    };
}
