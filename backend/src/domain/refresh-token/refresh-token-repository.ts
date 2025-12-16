import { NewRefreshToken, RefreshToken } from './refresh-token-types';
import { Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

export interface RefreshTokenRepository {
    create(
        newRefreshToken: NewRefreshToken,
    ): Promise<Result<RefreshToken, Error>>;
    findByToken(
        token: string,
    ): Promise<Result<RefreshToken, NotFoundError | Error>>;
    save(
        refreshToken: RefreshToken,
    ): Promise<Result<void, NotFoundError | Error>>;
    deleteByToken(
        token: string,
    ): Promise<Result<RefreshToken, NotFoundError | Error>>;
}
