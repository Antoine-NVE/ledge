import { MongoDBStorage, Umzug } from 'umzug';
import path from 'node:path';
import { createBaseLogger } from '../src/infrastructure/config/pino';
import { step } from '../src/infrastructure/utils/lifecycle';
import { connectToMongo } from '../src/infrastructure/config/mongo';

const start = async () => {
    const { baseLogger: pinoBaseLogger } = createBaseLogger({
        nodeEnv:
            process.env.NODE_ENV === 'production'
                ? 'production'
                : 'development',
    });

    const { db: mongoDb, client: mongoClient } = await step(
        'Mongo connection',
        pinoBaseLogger,
        async () => {
            return await connectToMongo();
        },
    );

    const umzug = new Umzug({
        migrations: {
            glob: path.join(__dirname, 'migrations', `*.js`),
        },
        context: mongoDb,
        storage: new MongoDBStorage({
            connection: mongoDb,
        }),
        logger: undefined,
    });
    umzug.on('migrating', (migration) => {
        pinoBaseLogger.info(
            { migrationName: migration.name },
            'Migration started',
        );
    });
    umzug.on('migrated', (migration) => {
        pinoBaseLogger.info(
            { migrationName: migration.name },
            'Migration finished',
        );
    });

    await step('Migration', pinoBaseLogger, async () => {
        const direction = process.argv[2];
        switch (direction) {
            case 'up':
                await umzug.up();
                break;
            case 'down':
                await umzug.down();
                break;
            default:
                pinoBaseLogger.error('Invalid migration direction');
        }
    });

    return { mongoClient, pinoBaseLogger };
};

start().then(async ({ mongoClient, pinoBaseLogger }) => {
    await mongoClient.close();
    pinoBaseLogger.info('Mongo disconnected');

    // Without this, Pino doesn't always have time to send all the logs to Loki
    await new Promise((r) => setTimeout(r, 100));
});
