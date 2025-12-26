import { RefreshToken } from './refresh-token-types';
import { NotFoundError } from '../../core/errors/not-found-error';
import { Result } from '../../core/types/result';

export interface RefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<Result<void, Error>>;
    findByValue(value: string): Promise<Result<RefreshToken | null, Error>>;
    findByValueAndExpiresAfter(value: string, expiresAtAfter: Date): Promise<Result<RefreshToken | null, Error>>;
    save(refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>>;
    delete(refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>>;
    findByValueAndDelete(value: string): Promise<Result<RefreshToken | null, Error>>;
}
