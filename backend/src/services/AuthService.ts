import {
    ExpiredRefreshTokenError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
} from '../errors/UnauthorizedError';
import { JwtService } from './JwtService';
import { User } from '../types/User';
import { RefreshToken } from '../types/RefreshToken';
import { UserService } from './UserService';
import { RefreshTokenService } from './RefreshTokenService';
import {
    RefreshTokenNotFoundError,
    UserNotFoundError,
} from '../errors/NotFoundError';
import { PasswordService } from './PasswordService';

export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
        private passwordService: PasswordService,
    ) {}

    register = async (
        email: string,
        password: string,
    ): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> => {
        const passwordHash = await this.passwordService.hash(password);

        const user = await this.userService.insertOne(email, passwordHash);

        const refreshToken = await this.refreshTokenService.insertOne(user._id);

        const accessToken = this.jwtService.signAccess(user._id);

        return { user, accessToken, refreshToken };
    };

    login = async (
        email: string,
        password: string,
    ): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> => {
        const user = await this.userService
            .findOneByEmail(email)
            .catch((err) => {
                if (err instanceof UserNotFoundError)
                    throw new InvalidCredentialsError();
                throw err;
            });

        const doesMatch = await this.passwordService.compare(
            password,
            user.passwordHash,
        );
        if (!doesMatch) throw new InvalidCredentialsError();

        const refreshToken = await this.refreshTokenService.insertOne(user._id);

        const accessToken = this.jwtService.signAccess(user._id);

        return { user, accessToken, refreshToken };
    };

    refresh = async (
        token: string,
    ): Promise<{ accessToken: string; refreshToken: RefreshToken }> => {
        let refreshToken = await this.refreshTokenService
            .findOneByToken(token)
            .catch((err) => {
                if (err instanceof RefreshTokenNotFoundError)
                    throw new InvalidRefreshTokenError();
                throw err;
            });
        if (refreshToken.expiresAt < new Date())
            throw new ExpiredRefreshTokenError();

        refreshToken.expiresAt = new Date(
            Date.now() + this.refreshTokenService.TTL,
        );
        refreshToken = await this.refreshTokenService.updateOne(refreshToken);

        const accessToken = this.jwtService.signAccess(refreshToken.userId);

        return { accessToken, refreshToken };
    };

    logout = async (token: string): Promise<void> => {
        await this.refreshTokenService.deleteOneByToken(token);
    };
}
