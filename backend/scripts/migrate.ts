import { MongoDBStorage, Umzug } from 'umzug';
import path from 'node:path';
import { createLogger } from '../src/infrastructure/config/logger-config';
import { connectToDb } from '../src/infrastructure/config/db-config';
import { MongoClient } from 'mongodb';
import { step } from '../src/infrastructure/utils/lifecycle-utils';

const start = async () => {
    const logger = createLogger(
        process.env.NODE_ENV === 'development' ? 'development' : 'production',
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
        if (direction === 'up') await umzug.up();
        if (direction === 'down') await umzug.down();
        logger.info('Migrations done');
    });

    return client;
};

start().then(async (client: MongoClient) => {
    await client.close();
});
