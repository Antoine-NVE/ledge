import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { MongoDBStorage, Umzug } from 'umzug';
import type { Db } from 'mongodb';
import type { Logger } from '../../domain/ports/logger.js';

type Input = {
    mongoDb: Db;
    logger: Logger;
};

export type Context = {
    mongoDb: Db;
};

export const createMigrationRunner = ({ mongoDb, logger }: Input) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return new Umzug<Context>({
        migrations: {
            glob: [path.join(__dirname, '../../../scripts/migrations', '*.{js,ts}'), { ignore: '**/*.d.ts' }],
        },
        context: { mongoDb },
        storage: new MongoDBStorage({ connection: mongoDb }),
        logger: {
            error: (msg) => logger.error('Migration error', msg),
            warn: (msg) => logger.warn('Migration warn', msg),
            info: (msg) => logger.info('Migration info', msg),
            debug: (msg) => logger.debug('Migration debug', msg),
        },
    });
};
