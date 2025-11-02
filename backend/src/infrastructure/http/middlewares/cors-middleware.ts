import { env } from '../../config/env';
import cors from 'cors';

export const corsMiddleware = cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
});
