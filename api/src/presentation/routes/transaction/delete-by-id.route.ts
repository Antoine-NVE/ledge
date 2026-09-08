import type { FastifyPluginAsync } from 'fastify';
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import z from 'zod';
import type { DeleteTransactionUseCase } from '../../../application/transaction/delete-transaction.use-case.js';
import type { AuthenticateUseCase } from '../../../application/auth/authenticate.use-case.js';
import { isAuthenticated } from '../../middlewares/is-authenticated.middleware.js';
import { badRequestSchema } from '../../schemas/bad-request.schema.js';
import { unauthorizedSchema } from '../../schemas/unauthorized.schema.js';
import { forbiddenSchema } from '../../schemas/forbidden.schema.js';
import { transactionNotFoundSchema } from '../../schemas/transaction-not-found.schema.js';
import { payloadTooLargeSchema } from '../../schemas/payload-too-large.schema.js';
import { tooManyRequestsSchema } from '../../schemas/too-many-requests.schema.js';
import { internalServerErrorSchema } from '../../schemas/internal-server-error.schema.js';

type Options = {
    deleteTransactionUseCase: DeleteTransactionUseCase;
    authenticateUseCase: AuthenticateUseCase;
};

export const deleteTransactionByIdRoute: FastifyPluginAsync<Options> = async (
    app,
    { deleteTransactionUseCase, authenticateUseCase },
) => {
    app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
        method: 'DELETE',
        url: '/transactions/:id',
        schema: {
            tags: ['Transaction'],
            params: z.object({
                id: z.string(),
            }),
            response: {
                204: { description: 'Transaction deleted successfully' },
                400: badRequestSchema,
                401: unauthorizedSchema,
                403: forbiddenSchema,
                404: transactionNotFoundSchema,
                413: payloadTooLargeSchema,
                429: tooManyRequestsSchema,
                500: internalServerErrorSchema,
            },
        } satisfies FastifyZodOpenApiSchema,
        preHandler: isAuthenticated(authenticateUseCase),
        handler: async (request, reply) => {
            const result = await deleteTransactionUseCase.execute(request.params.id, request.session.userId);
            if (!result.success) {
                switch (result.code) {
                    case 'TRANSACTION_NOT_OWNED':
                        request.log.warn({ code: result.code }, 'Forbidden');
                        return reply.status(403).send({ code: 'FORBIDDEN' });
                    case 'TRANSACTION_NOT_FOUND':
                        request.log.warn({ code: result.code }, 'Not found');
                        return reply.status(404).send({ code: 'TRANSACTION_NOT_FOUND' });
                }
            }
            const transaction = result.data;

            request.log.info({ transactionId: transaction.id }, 'Transaction deleted');
            return reply.status(204).send();
        },
    });
};
