import pino, { type Logger as BaseLogger } from 'pino';
import type { Env } from './env.js';

type Input = {
    nodeEnv: Env['nodeEnv'];
    lokiUrl: Env['lokiUrl'];
};

type Output = BaseLogger;

export const createBaseLogger = ({ nodeEnv, lokiUrl }: Input): Output => {
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
            : {
                  target: 'pino-loki',
                  options: {
                      host: lokiUrl,
                      batching: false,
                      labels: {
                          service_name: 'backend',
                      },
                  },
              },
    });
};
