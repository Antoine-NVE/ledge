import { InvalidCredentialsError } from '../errors/UnauthorizedErrors';
import RefreshTokenModel, { RefreshTokenDocument } from '../models/RefreshToken';
import UserModel, { UserDocument } from '../models/User';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import UserRepository from '../repositories/UserRepository';
import { generateToken } from '../utils/token';
import { createAccessJwt } from './jwt';
import bcrypt from 'bcrypt';

export default class AuthService {
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

        const userRepository = new UserRepository(UserModel);
        const user = await userRepository.create({
            email,
            password,
            isEmailVerified,
        });

        const accessToken = createAccessJwt(user._id.toString(), process.env.JWT_SECRET!);

        const refreshTokenModel = new RefreshTokenRepository(RefreshTokenModel);
        const refreshToken = await refreshTokenModel.create({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            user: user._id,
        });

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
        const userRepository = new UserRepository(UserModel);

        const user = await userRepository.findByEmail(email);
        if (!user) throw new InvalidCredentialsError();

        const doesMatch = await bcrypt.compare(password, user.password);
        if (!doesMatch) throw new InvalidCredentialsError();

        const accessToken = createAccessJwt(user._id.toString(), process.env.JWT_SECRET!);

        const refreshTokenModel = new RefreshTokenRepository(RefreshTokenModel);
        const refreshToken = await refreshTokenModel.create({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            user: user._id,
        });

        return { user, accessToken, refreshToken };
    }
}
