import { connectToDb } from './infrastructure/config/db-config';
import { createHttpServer } from './presentation/http/http-server';
import { buildContainer } from './infrastructure/config/container-config';
import { loadEnv } from './infrastructure/config/env-config';
import { createLogger } from './infrastructure/config/logger-config';
import { connectToCache } from './infrastructure/config/cache-config';

const start = async () => {
    // .env is not verified yet, but we need a logger now
    const logger = createLogger(
        process.env.NODE_ENV === 'development' ? 'development' : 'production',
    );

    try {
        const env = loadEnv();
        logger.info('Environment validated');

        const cacheClient = await connectToCache();
        logger.info('Redis connected');

        const { db } = await connectToDb();
        logger.info('MongoDB connected');

        const container = buildContainer(env, cacheClient, db);

        const app = createHttpServer(env, container, logger);
        const server = app.listen(3000);

        server.on('listening', () => {
            logger.info('HTTP server listening');
        });

        server.on('error', (err) => {
            logger.fatal({ err }, 'HTTP server failed');
            process.exit(1);
        });
    } catch (err) {
        logger.fatal({ err }, 'Startup failed');
        process.exit(1);
    }
};

start().then();
