import type { Express } from 'express';
import { Server } from 'node:http';

export const startHttpServer = ({ app, port }: { app: Express; port: number }): Promise<Server> => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port);

        server.on('listening', () => resolve(server));
        server.on('error', (err) => reject(err));
    });
};
