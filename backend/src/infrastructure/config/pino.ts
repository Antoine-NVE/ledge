import pino, { BaseLogger } from 'pino';

export const createBaseLogger = ({ nodeEnv, lokiUrl }: { nodeEnv: 'development' | 'production'; lokiUrl: string }) => {
    const isDev = nodeEnv === 'development';

    const baseLogger: BaseLogger = pino({
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

    return baseLogger;
};
