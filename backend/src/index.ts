import { connectToDb } from './infrastructure/config/db-config';
import { createApp } from './presentation/app';
import { buildContainer } from './infrastructure/config/container-config';
import { loadEnv } from './infrastructure/config/env-config';
import { createLogger } from './infrastructure/config/logger-config';
import { connectToCache } from './infrastructure/config/cache-config';
import { step, stop } from './infrastructure/utils/lifecycle-utils';

const start = async () => {
    // .env is not verified yet, but we need a logger now
    const logger = createLogger(
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
    );

    const env = await step('Environment validation', logger, async () => {
        const env = loadEnv();
        logger.info('Environment validated');
        return env;
    });

    const cacheClient = await step('Redis connection', logger, async () => {
        const client = await connectToCache();
        logger.info('Redis connected');
        return client;
    });

    const db = await step('MongoDB connection', logger, async () => {
        const { db } = await connectToDb();
        logger.info('MongoDB connected');
        return db;
    });

    const container = buildContainer(env, cacheClient, db, logger);

    const app = createApp(env, container, logger);
    const server = app.listen(3000);
    server.on('listening', () => {
        logger.info('HTTP server started');
    });
    server.on('error', (err) => {
        stop(logger, 'HTTP server startup', err);
    });
};

start().then();
