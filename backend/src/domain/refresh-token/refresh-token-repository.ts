import type { RefreshToken } from './refresh-token-types.js';

export interface RefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<void>;
    findByValue(value: string): Promise<RefreshToken | null>;
    save(refreshToken: RefreshToken): Promise<void>;
    delete(refreshToken: RefreshToken): Promise<void>;
}
