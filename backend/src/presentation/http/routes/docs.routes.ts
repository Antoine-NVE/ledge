import { Router } from 'express';
import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'node:url';

export const createDocsRoutes = () => {
    const router = Router();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    router.use(
        '/',
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
                apis: [path.join(__dirname, './*.routes.{js,ts}')],
            }),
        ),
    );

    return router;
};
