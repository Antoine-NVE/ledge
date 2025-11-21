import pino from 'pino';
import { env } from './env-config';

const isDev = env.NODE_ENV === 'development';

export const logger = pino({
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
