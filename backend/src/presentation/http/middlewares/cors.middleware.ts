import cors from 'cors';
import type { Env } from '../../../infrastructure/config/env.js';

export const corsMiddleware = ({ allowedOrigins }: { allowedOrigins: Env['allowedOrigins'] }) => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    });
};
