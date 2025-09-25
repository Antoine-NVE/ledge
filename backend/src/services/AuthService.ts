import { InvalidCredentialsError } from '../errors/UnauthorizedErrors';
import RefreshTokenModel, { RefreshTokenDocument } from '../models/RefreshToken';
import UserModel, { UserDocument } from '../models/User';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import UserRepository from '../repositories/UserRepository';
import { generateToken } from '../utils/token';
import bcrypt from 'bcrypt';
import JwtService from './JwtService';
import RefreshTokenService from './RefreshTokenService';

export default class AuthService {
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

        const accessToken = this.jwtService.signAccessJwt(user._id.toString());

        const refreshToken = await this.refreshTokenService.createRefreshToken(user._id);

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

        const accessToken = this.jwtService.signAccessJwt(user._id.toString());

        const refreshToken = await this.refreshTokenService.createRefreshToken(user._id);

        return { user, accessToken, refreshToken };
    }
}
