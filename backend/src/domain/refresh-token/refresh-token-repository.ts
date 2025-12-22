import { RefreshToken } from './refresh-token-types';
import { Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

export interface RefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<Result<void, Error>>;
    findByValue(value: string): Promise<Result<RefreshToken, Error | NotFoundError>>;
    save(refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>>;
    delete(refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>>;
}
