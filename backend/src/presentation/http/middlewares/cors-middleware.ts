import cors from 'cors';
import { Env } from '../../../infrastructure/types/env-type';

export const createCorsMiddleware = (env: Env) => {
    return cors({
        origin: env.ALLOWED_ORIGINS,
        credentials: true,
    });
};
