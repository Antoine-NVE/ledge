import { Express } from 'express';
import { Server } from 'node:http';

export const startHttpServer = ({ app }: { app: Express }): Promise<Server> => {
    return new Promise((resolve, reject) => {
        const server = app.listen(3000);

        server.on('listening', () => resolve(server));
        server.on('error', (err) => reject(err));
    });
};
