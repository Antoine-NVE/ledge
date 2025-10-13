import {
    ExpiredRefreshTokenError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
} from '../errors/UnauthorizedError';
import bcrypt from 'bcrypt';
import { JwtService } from './JwtService';
import { User } from '../types/User';
import { RefreshToken } from '../types/RefreshToken';
import { UserService } from './UserService';
import { RefreshTokenService } from './RefreshTokenService';
import { RefreshTokenNotFoundError, UserNotFoundError } from '../errors/NotFoundError';

export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
    ) {}

    register = async (
        email: string,
        password: string,
    ): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> => {
        const passwordHash = await bcrypt.hash(password, 10);
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
        const user = await this.userService.findOneByEmail(email).catch((err) => {
            if (err instanceof UserNotFoundError) throw new InvalidCredentialsError();
            throw err;
        });

        const doesMatch = await bcrypt.compare(password, user.passwordHash);
        if (!doesMatch) throw new InvalidCredentialsError();

        const refreshToken = await this.refreshTokenService.insertOne(user._id);

        const accessToken = this.jwtService.signAccess(user._id);

        return { user, accessToken, refreshToken };
    };

    refresh = async (
        token: string,
    ): Promise<{ accessToken: string; refreshToken: RefreshToken }> => {
        let refreshToken = await this.refreshTokenService.findOneByToken(token).catch((err) => {
            if (err instanceof RefreshTokenNotFoundError) throw new InvalidRefreshTokenError();
            throw err;
        });
        if (refreshToken.expiresAt < new Date()) throw new ExpiredRefreshTokenError();

        refreshToken.expiresAt = new Date(Date.now() + RefreshTokenService.TTL);
        refreshToken = await this.refreshTokenService.updateOne(refreshToken);

        const accessToken = this.jwtService.signAccess(refreshToken.userId);

        return { accessToken, refreshToken };
    };

    logout = async (token: string): Promise<void> => {
        await this.refreshTokenService.deleteOneByToken(token);
    };
}
