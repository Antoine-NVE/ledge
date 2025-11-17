import { MongoDBStorage, Umzug } from 'umzug';
import { client, db } from '../src/infrastructure/config/db-config';
import path from 'node:path';

const umzug = new Umzug({
    migrations: {
        glob: path.join(__dirname, 'migrations', `*.js`),
    },
    context: db,
    storage: new MongoDBStorage({
        connection: db,
    }),
    logger: console,
});

const direction = process.argv[2];

(async () => {
    try {
        if (direction === 'up') await umzug.up();
        if (direction === 'down') await umzug.down();

        console.log('Migration done');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.close();
    }
})();
