import pino from 'pino';

export const createLogger = (nodeEnv: 'development' | 'production') => {
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
                      host: 'http://logs:3100',
                      batching: false,
                      labels: {
                          service_name: 'backend',
                      },
                  },
              },
    });
};
