import {
    ExpiredRefreshTokenError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
    RequiredRefreshTokenError,
} from '../errors/UnauthorizedError';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { UserRepository } from '../repositories/UserRepository';
import { generateToken } from '../utils/token';
import bcrypt from 'bcrypt';
import { JwtService } from './JwtService';
import { WithId } from 'mongodb';
import { User } from '../types/userType';
import { userSchema } from '../schemas/userSchema';
import { RefreshToken } from '../types/refreshTokenType';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { UserService } from './UserService';
import { RefreshTokenService } from './RefreshTokenService';

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

        const accessToken = this.jwtService.signAccessJwt(user._id);

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
        const user = await this.userService.findOneByEmail(email);
        if (!user) throw new InvalidCredentialsError();

        const doesMatch = await bcrypt.compare(password, user.passwordHash);
        if (!doesMatch) throw new InvalidCredentialsError();

        const refreshToken = await this.refreshTokenService.insertOne(user._id);

        const accessToken = this.jwtService.signAccessJwt(user._id);

        return { user, accessToken, refreshToken };
    };

    refresh = async (
        token: string,
    ): Promise<{ accessToken: string; refreshToken: RefreshToken }> => {
        let refreshToken = await this.refreshTokenService.findOneByToken(token);
        if (!refreshToken) throw new InvalidRefreshTokenError();
        if (refreshToken.expiresAt < new Date()) throw new ExpiredRefreshTokenError();

        refreshToken.expiresAt = new Date(Date.now() + RefreshTokenService.TTL);
        refreshToken = await this.refreshTokenService.updateOne(refreshToken);

        const accessToken = this.jwtService.signAccessJwt(refreshToken.userId);

        return { accessToken, refreshToken };
    };

    logout = async (token: string): Promise<void> => {
        await this.refreshTokenService.deleteOneByToken(token);
    };
}
