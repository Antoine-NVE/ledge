import { createBaseLogger } from '../src/infrastructure/config/pino.js';
import { connectToMongo } from '../src/infrastructure/config/mongo.js';
import { PinoLogger } from '../src/infrastructure/adapters/pino.logger.js';
import { loadEnv } from '../src/infrastructure/config/env.js';
import { createMigrationRunner } from '../src/infrastructure/config/umzug.js';

// .env is not verified yet, but we need a logger now
const logger = new PinoLogger(
    createBaseLogger({
        nodeEnv: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        lokiUrl: process.env.LOKI_URL || 'http://loki:3100',
    }),
);

const run = async () => {
    const { mongoUrl } = loadEnv();
    logger.info('Environment loaded');

    const { mongoDb, mongoClient } = await connectToMongo({ mongoUrl });
    logger.info('Mongo connected');

    try {
        const umzug = createMigrationRunner({ mongoDb, logger });

        const command = process.argv[2];
        if (command !== 'up' && command !== 'down') {
            throw new Error("Invalid migration command. Please choose between 'up' and 'down'");
        }

        await umzug[command]();
        logger.info(`Migration '${command}' executed successfully`);
    } finally {
        await mongoClient.close().catch(() => {});
        logger.info('Mongo disconnected');
    }
};

try {
    await run();
    await new Promise((r) => setTimeout(r, 250));
    process.exit(0);
} catch (error) {
    logger.fatal(error instanceof Error ? error.message : 'Unknown error', { err: error });
    await new Promise((r) => setTimeout(r, 250));
    process.exit(1);
}
