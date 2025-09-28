import {
    ExpiredRefreshTokenError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
    RequiredRefreshTokenError,
} from '../errors/UnauthorizedError';
import RefreshTokenModel, { RefreshTokenDocument } from '../models/RefreshToken';
import UserModel, { UserDocument } from '../models/User';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { UserRepository } from '../repositories/UserRepository';
import { generateToken } from '../utils/token';
import bcrypt from 'bcrypt';
import { JwtService } from './JwtService';
import { RefreshTokenService } from './RefreshTokenService';

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
    ) {}

    async register(
        email: string,
        password: string,
    ): Promise<{
        user: UserDocument;
        accessToken: string;
        refreshToken: RefreshTokenDocument;
    }> {
        // By default, new users are not email verified
        const isEmailVerified = false;

        const user = await this.userRepository.create({
            email,
            password,
            isEmailVerified,
        });

        const accessToken = this.jwtService.signAccessJwt(user._id);
        const refreshToken = await this.refreshTokenService.create(user._id);

        return { user, accessToken, refreshToken };
    }

    async login(
        email: string,
        password: string,
    ): Promise<{
        user: UserDocument;
        accessToken: string;
        refreshToken: RefreshTokenDocument;
    }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new InvalidCredentialsError();

        const doesMatch = await bcrypt.compare(password, user.password);
        if (!doesMatch) throw new InvalidCredentialsError();

        const accessToken = this.jwtService.signAccessJwt(user._id);
        const refreshToken = await this.refreshTokenService.create(user._id);

        return { user, accessToken, refreshToken };
    }

    async refresh(token: string): Promise<{ accessToken: string; refreshToken: RefreshTokenDocument }> {
        const refreshToken = await this.refreshTokenService.findByToken(token);
        const accessToken = this.jwtService.signAccessJwt(refreshToken.user._id);

        // Extend the refresh token expiration each time it is used
        const newRefreshToken = await this.refreshTokenService.extendExpiration(refreshToken);

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(token: string | undefined): Promise<void> {
        if (token) {
            await this.refreshTokenService.deleteByToken(token);
        }
    }
}
