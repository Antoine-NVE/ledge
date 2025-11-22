import pino from 'pino';
import { Env } from '../types/env-type';

export const createLogger = (env: Env) => {
    const isDev = env.NODE_ENV === 'development';

    return pino({
        level: isDev ? 'debug' : 'info', // Minimum level to show. List: fatal > error > warn > info > debug > trace
        transport: isDev
            ? {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                  },
              }
            : undefined, // JSON in production
    });
};
