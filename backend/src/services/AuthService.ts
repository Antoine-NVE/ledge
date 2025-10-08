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
import { User, UserCredentials } from '../types/userType';
import { userSchema } from '../schemas/userSchema';
import { RefreshToken } from '../types/refreshTokenType';
import { partialRefreshTokenSchema, refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { UserService } from './UserService';

export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenRepository: RefreshTokenRepository,
    ) {}

    async register({ email, password }: UserCredentials): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userService.insertOne(email, passwordHash);

        const refreshTokenData = refreshTokenSchema.parse({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userId: user._id,
            createdAt: new Date(),
            updatedAt: null,
        });
        const refreshToken = await this.refreshTokenRepository.insertOne(refreshTokenData);

        const accessToken = this.jwtService.signAccessJwt(user._id);

        return { user, accessToken, refreshToken };
    }

    async login({ email, password }: UserCredentials): Promise<{
        user: User;
        accessToken: string;
        refreshToken: RefreshToken;
    }> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) throw new InvalidCredentialsError();

        const doesMatch = await bcrypt.compare(password, user.passwordHash);
        if (!doesMatch) throw new InvalidCredentialsError();

        const refreshTokenData = refreshTokenSchema.parse({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userId: user._id,
            createdAt: new Date(),
            updatedAt: null,
        });
        const refreshToken = await this.refreshTokenRepository.insertOne(refreshTokenData);

        const accessToken = this.jwtService.signAccessJwt(user._id);

        return { user, accessToken, refreshToken };
    }

    async refresh(token: string): Promise<{ accessToken: string; refreshToken: RefreshToken }> {
        let refreshToken = await this.refreshTokenRepository.findOneByToken(token);
        if (!refreshToken) throw new InvalidRefreshTokenError();
        if (refreshToken.expiresAt < new Date()) throw new ExpiredRefreshTokenError();

        const refreshTokenData = partialRefreshTokenSchema.parse({
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            updatedAt: new Date(),
        });
        refreshToken = await this.refreshTokenRepository.findOneByIdAndUpdate(
            refreshToken._id,
            refreshTokenData,
        );
        if (!refreshToken) throw new InvalidRefreshTokenError(); // Shouldn't happen

        const accessToken = this.jwtService.signAccessJwt(refreshToken.userId);

        return { accessToken, refreshToken };
    }

    async logout(token: string): Promise<void> {
        await this.refreshTokenRepository.deleteOneByToken(token);
    }
}
