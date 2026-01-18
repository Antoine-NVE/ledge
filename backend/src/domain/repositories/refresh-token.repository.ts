import type { RefreshToken } from '../entities/refresh-token.js';

export interface RefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<void>;
    findByValue(value: string): Promise<RefreshToken | null>;
    save(refreshToken: RefreshToken): Promise<void>;
    delete(refreshToken: RefreshToken): Promise<void>;
}
