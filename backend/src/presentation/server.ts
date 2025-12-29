import type { Express } from 'express';
import { Server } from 'node:http';
import type { Result } from '../core/types/result.js';
import { fail, ok } from '../core/utils/result.js';
import { ensureError } from '../core/utils/error.js';

type Input = {
    app: Express;
    port: number;
};

type Output = {
    server: Server;
};

export const startServer = ({ app, port }: Input): Promise<Result<Output, Error>> => {
    return new Promise((resolve) => {
        const server = app.listen(port);

        server.on('listening', () => {
            resolve(ok({ server }));
        });

        server.on('error', (err) => {
            resolve(fail(ensureError(err)));
        });
    });
};
