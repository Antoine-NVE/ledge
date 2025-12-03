import { MongoDBStorage, Umzug } from 'umzug';
import path from 'node:path';
import { createBaseLogger } from '../src/infrastructure/config/pino';
import { connectToMongo } from '../src/infrastructure/config/mongo';
import { PinoLogger } from '../src/infrastructure/adapters/pino-logger';
import { step } from '../src/core/utils/lifecycle';

const start = async () => {
    const logger = new PinoLogger(
        createBaseLogger({
            nodeEnv:
                process.env.NODE_ENV === 'production'
                    ? 'production'
                    : 'development',
        }),
    );

    const { db, client } = await step('Mongo connection', logger, async () => {
        return await connectToMongo();
    });

    const umzug = new Umzug({
        migrations: {
            glob: path.join(__dirname, 'migrations', `*.js`),
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
