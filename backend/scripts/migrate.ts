import { createBaseLogger } from '../src/infrastructure/config/pino.js';
import { connectToMongo } from '../src/infrastructure/config/mongo.js';
import { PinoLogger } from '../src/infrastructure/adapters/pino.logger.js';
import { loadEnv } from '../src/infrastructure/config/env.js';
import { fail, ok } from '../src/core/utils/result.js';
import type { Result } from '../src/core/types/result.js';
import type { MongoClient } from 'mongodb';
import { createMigrationRunner } from '../src/infrastructure/config/umzug.js';

type Output = {
    mongoClient: MongoClient;
};

// .env is not verified yet, but we need a logger now
const logger = new PinoLogger(
    createBaseLogger({
        nodeEnv: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        lokiUrl: process.env.LOKI_URL || 'http://loki:3100',
    }),
);

const start = async (): Promise<Result<Output, Error>> => {
    const envResult = loadEnv();
    if (!envResult.success) return fail(new Error('Failed to load environment', { cause: envResult.error }));
    const { mongoUrl } = envResult.data;
    logger.info('Environment loaded');

    const mongoResult = await connectToMongo({ mongoUrl });
    if (!mongoResult.success) return fail(new Error('Failed to connect to Mongo', { cause: mongoResult.error }));
    const { mongoDb, mongoClient } = mongoResult.data;
    logger.info('Mongo connected');

    const umzug = createMigrationRunner({ mongoDb, logger });

    const commands: Record<string, () => Promise<unknown>> = {
        up: () => umzug.up(),
        down: () => umzug.down(),
    };
    const commandName = process.argv[2] || '';
    const command = commands[commandName];
    if (!command) return fail(new Error("Invalid migration command. Please choose between 'up' and 'down'"));

    const migrationResult = await command()
        .then(() => ok(undefined))
        .catch((err) => fail(err));
    if (!migrationResult.success) return fail(new Error('Failed to run migration', { cause: migrationResult.error }));
    logger.info('Migration run');

    return ok({ mongoClient });
};

const result = await start();
if (!result.success) {
    logger.fatal(result.error.message, { err: result.error });
    process.exit(1);
}
const { mongoClient } = result.data;

await mongoClient.close().catch(() => {});
logger.info('Mongo disconnected');

// Without this, Pino doesn't always have time to send all the logs to Loki
await new Promise((r) => setTimeout(r, 250));
process.exit(0);
