import { MongoDBStorage, Umzug } from 'umzug';
import path from 'node:path';
import { createLogger } from '../src/infrastructure/config/logger-config';
import { connectToDb } from '../src/infrastructure/config/db-config';
import { step } from '../src/infrastructure/utils/lifecycle';

const start = async () => {
    const logger = createLogger(
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
    );

    const { db, client } = await step(
        'MongoDB connection',
        logger,
        async () => {
            const { db, client } = await connectToDb();
            logger.info('MongoDB connected');
            return { db, client };
        },
    );

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
        logger.info({ migrationName: migration.name }, 'Migration started');
    });
    umzug.on('migrated', (migration) => {
        logger.info({ migrationName: migration.name }, 'Migration finished');
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
    logger.info('MongoDB disconnected');

    // Without this, Pino doesn't always have time to send all the logs to Loki
    await new Promise((r) => setTimeout(r, 100));
});
