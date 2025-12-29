import { MongoDBStorage, Umzug } from 'umzug';
import path from 'node:path';
import { createBaseLogger } from '../src/infrastructure/config/pino.js';
import { connectToMongo } from '../src/infrastructure/config/mongo.js';
import { PinoLogger } from '../src/infrastructure/adapters/pino-logger.js';
import { step } from '../src/core/utils/lifecycle.js';
import { loadEnv } from '../src/infrastructure/config/env.js';

const start = async () => {
    const logger = new PinoLogger(
        createBaseLogger({
            nodeEnv: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        }),
    );

    const { databaseUrl } = await step('Environment validation', logger, async () => {
        return loadEnv();
    });

    const { db, client } = await step('Mongo connection', logger, async () => {
        return await connectToMongo({ url: databaseUrl });
    });

    const umzug = new Umzug({
        migrations: {
            glob: path.join(__dirname, 'migrations', `*.{js,ts}`),
        },
        context: db,
        storage: new MongoDBStorage({
            connection: db,
        }),
        logger: undefined,
    });
    umzug.on('migrating', (migration) => {
        logger.info('Migration started', { migrationName: migration.name });
    });
    umzug.on('migrated', (migration) => {
        logger.info('Migration finished', { migrationName: migration.name });
    });

    await step('Migration', logger, async () => {
        const direction = process.argv[2];
        switch (direction) {
            case 'up':
                await umzug.up();
                break;
            case 'down':
                await umzug.down();
                break;
            default:
                logger.error('Invalid migration direction');
        }
    });

    return { client, logger };
};

start().then(async ({ client, logger }) => {
    await client.close();
    logger.info('Mongo disconnected');

    // Without this, Pino doesn't always have time to send all the logs to Loki
    await new Promise((r) => setTimeout(r, 100));
});
