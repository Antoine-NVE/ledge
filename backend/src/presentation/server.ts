import type { Express } from 'express';
import { Server } from 'node:http';
import { fail, ok, type Result } from '../core/result.js';
import type { Env } from '../infrastructure/config/env.js';

type Input = {
    app: Express;
    port: Env['port'];
};

type Output = {
    server: Server;
};

export const startServer = ({ app, port }: Input): Promise<Result<Output, unknown>> => {
    return new Promise((resolve) => {
        const server = app.listen(port);

        server.on('listening', () => {
            resolve(ok({ server }));
        });

        server.on('error', (err: unknown) => {
            resolve(fail(err));
        });
    });
};
