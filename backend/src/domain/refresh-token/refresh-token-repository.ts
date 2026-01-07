import type { RefreshToken } from './refresh-token-types.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Result } from '../../core/types/result.js';

export interface RefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<Result<void, Error>>;
    findByValue(value: string): Promise<Result<RefreshToken | null, Error>>;
    save(refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>>;
    delete(refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>>;
}
