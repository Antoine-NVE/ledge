import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ledge API',
            version: '1.0.0',
        },
    },
    apis: ['./src/presentation/*/*-routes.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swagger = swaggerUi.setup(swaggerSpec);
