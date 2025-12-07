import { NewRefreshToken, RefreshToken } from './refresh-token-types';

export interface RefreshTokenRepository {
    create(newRefreshToken: NewRefreshToken): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    save(refreshToken: RefreshToken): Promise<void>;
    deleteByToken(token: string): Promise<RefreshToken | null>;
}
