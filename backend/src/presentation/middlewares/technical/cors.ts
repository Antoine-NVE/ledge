import cors from 'cors';
import { Env } from '../../../infrastructure/config/env';

export const createCors = (allowedOrigins: Env['ALLOWED_ORIGINS']) => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    });
};
