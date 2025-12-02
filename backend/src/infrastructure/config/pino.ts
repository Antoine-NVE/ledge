import pino, { BaseLogger } from 'pino';

export const createBaseLogger = ({
    nodeEnv,
}: {
    nodeEnv: 'development' | 'production';
}) => {
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
                      host: 'http://logs:3100',
                      batching: false,
                      labels: {
                          service_name: 'backend',
                      },
                  },
              },
    });

    return baseLogger;
};
