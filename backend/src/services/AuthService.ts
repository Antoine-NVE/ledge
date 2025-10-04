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

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private refreshTokenRepository: RefreshTokenRepository,
    ) {}

    async register({ email, password }: UserCredentials): Promise<{
        user: WithId<User>;
        accessToken: string;
        refreshToken: WithId<RefreshToken>;
    }> {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = userSchema.parse({
            email,
            passwordHash,
            isEmailVerified: false,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date(),
            updatedAt: null,
        });
        const user = await this.userRepository.insert({
            ...newUser,
        });

        const accessToken = this.jwtService.signAccessJwt(user._id);

        const newRefreshToken = refreshTokenSchema.parse({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userId: user._id,
        });
        const refreshToken = await this.refreshTokenRepository.insert({
            ...newRefreshToken,
        });

        return { user, accessToken, refreshToken };
    }

    async login({ email, password }: UserCredentials): Promise<{
        user: WithId<User>;
        accessToken: string;
        refreshToken: WithId<RefreshToken>;
    }> {
        const user = await this.userRepository.findOneByEmail(email);
        if (!user) throw new InvalidCredentialsError();

        const doesMatch = await bcrypt.compare(password, user.passwordHash);
        if (!doesMatch) throw new InvalidCredentialsError();

        const accessToken = this.jwtService.signAccessJwt(user._id);

        const newRefreshToken = refreshTokenSchema.parse({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userId: user._id,
        });
        const refreshToken = await this.refreshTokenRepository.insert({
            ...newRefreshToken,
        });

        return { user, accessToken, refreshToken };
    }

    async refresh(
        token: string,
    ): Promise<{ accessToken: string; refreshToken: WithId<RefreshToken> }> {
        let refreshToken = await this.refreshTokenRepository.findOneByToken(token);
        if (!refreshToken) throw new InvalidRefreshTokenError();
        if (refreshToken.expiresAt < new Date()) throw new ExpiredRefreshTokenError();

        const refreshTokenData = partialRefreshTokenSchema.parse({
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        refreshToken = await this.refreshTokenRepository.findOneByIdAndUpdate(refreshToken._id, {
            ...refreshTokenData,
        });
        if (!refreshToken) throw new InvalidRefreshTokenError(); // Shouldn't happen

        const accessToken = this.jwtService.signAccessJwt(refreshToken.userId);

        return { accessToken, refreshToken };
    }

    async logout(token: string): Promise<void> {
        await this.refreshTokenService.deleteByToken(token);
    }
}
