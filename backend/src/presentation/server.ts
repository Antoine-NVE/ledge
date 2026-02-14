import type { Express } from 'express';
import { Server } from 'node:http';
import { fail, ok, type Result } from '../core/result.js';

type Input = {
    app: Express;
    port: number;
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
