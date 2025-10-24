import { JwtService } from './JwtService';
import { User } from '../types/User';
import { RefreshToken } from '../types/RefreshToken';
import { UserService } from './UserService';
import { RefreshTokenService } from './RefreshTokenService';
import { PasswordService } from './PasswordService';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';

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
                if (err instanceof NotFoundError)
                    throw new UnauthorizedError('Invalid credentials');
                throw err;
            });

        const doesMatch = await this.passwordService.compare(
            password,
            user.passwordHash,
        );
        if (!doesMatch) throw new UnauthorizedError('Invalid credentials');

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
                if (err instanceof NotFoundError)
                    throw new UnauthorizedError('Invalid refresh token');
                throw err;
            });
        if (refreshToken.expiresAt < new Date())
            throw new UnauthorizedError('Expired refresh token');

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
