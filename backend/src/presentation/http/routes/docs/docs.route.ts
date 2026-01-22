import type { Router } from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

export const docsRoute = (router: Router) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    router.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerJsdoc({
                definition: {
                    openapi: '3.0.0',
                    info: {
                        title: 'Ledge API',
                        version: '1.0.0',
                    },
                },
                apis: [path.join(__dirname, '../**/*.routes.{js,ts}')],
            }),
        ),
    );
};
