import pino from 'pino';
import { Env } from '../types/env-type';

export const createLogger = (nodeEnv: Env['NODE_ENV']) => {
    const isDev = nodeEnv === 'development';

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
