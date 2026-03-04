import type { Express } from 'express';
import { Server } from 'node:http';
import type { Env } from '../infrastructure/config/env.js';

type Input = {
    app: Express;
    port: Env['port'];
};

type Output = {
    server: Server;
};

export const startServer = ({ app, port }: Input): Promise<Output> => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            resolve({ server });
        });

        server.on('error', (err) => {
            reject(err);
        });
    });
};
