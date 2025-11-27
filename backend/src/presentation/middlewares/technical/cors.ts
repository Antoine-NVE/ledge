import cors from 'cors';
import { Env } from '../../../infrastructure/types/env-type';

export const createCors = (allowedOrigins: Env['ALLOWED_ORIGINS']) => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    });
};
