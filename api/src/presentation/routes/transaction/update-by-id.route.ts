import type { FastifyPluginAsync } from 'fastify';
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import z from 'zod';
import type { UpdateTransactionUseCase } from '../../../application/transaction/update-transaction.use-case.js';
import type { AuthenticateUseCase } from '../../../application/auth/authenticate.use-case.js';
import { isAuthenticated } from '../../middlewares/is-authenticated.middleware.js';
import { transactionSchema } from '../../schemas/transaction.schema.js';
import { badRequestSchema } from '../../schemas/bad-request.schema.js';
import { unauthorizedSchema } from '../../schemas/unauthorized.schema.js';
import { forbiddenSchema } from '../../schemas/forbidden.schema.js';
import { transactionNotFoundSchema } from '../../schemas/transaction-not-found.schema.js';
import { payloadTooLargeSchema } from '../../schemas/payload-too-large.schema.js';
import { tooManyRequestsSchema } from '../../schemas/too-many-requests.schema.js';
import { internalServerErrorSchema } from '../../schemas/internal-server-error.schema.js';
import { TransactionMapper } from '../../mappers/transaction.mapper.js';
import { unprocessableContentSchema } from '../../schemas/unprocessable-content.schema.js';

type Options = {
    updateTransactionUseCase: UpdateTransactionUseCase;
    authenticateUseCase: AuthenticateUseCase;
};

export const updateTransactionByIdRoute: FastifyPluginAsync<Options> = async (
    app,
    { updateTransactionUseCase, authenticateUseCase },
) => {
    app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
        method: 'PUT',
        url: '/transactions/:id',
        schema: {
            tags: ['Transaction'],
            params: z.object({
                id: z.string(),
            }),
            body: z.object({
                name: z.string(),
                value: z.number(),
                type: z.enum(['income', 'expense']),
                category: z.enum(['need', 'want', 'investment']).optional(),
                date: z.string().transform((value) => new Date(value)),
            }),
            response: {
                200: transactionSchema,
                400: badRequestSchema,
                401: unauthorizedSchema,
                403: forbiddenSchema,
                404: transactionNotFoundSchema,
                413: payloadTooLargeSchema,
                422: unprocessableContentSchema,
                429: tooManyRequestsSchema,
                500: internalServerErrorSchema,
            },
        } satisfies FastifyZodOpenApiSchema,
        preHandler: isAuthenticated(authenticateUseCase),
        handler: async (request, reply) => {
            const { name, value, type, category, date } = request.body;

            const result = await updateTransactionUseCase.execute(
                request.params.id,
                request.session.userId,
                name,
                value,
                type,
                category,
                date,
            );
            if (!result.success) {
                switch (result.code) {
                    case 'TRANSACTION_NOT_OWNED':
                        request.log.warn({ code: result.code }, 'Forbidden');
                        return reply.status(403).send({ code: 'FORBIDDEN' });
                    case 'TRANSACTION_NOT_FOUND':
                        request.log.warn({ code: result.code }, 'Not found');
                        return reply.status(404).send({ code: 'TRANSACTION_NOT_FOUND' });
                    case 'TRANSACTION_NAME_INVALID':
                    case 'TRANSACTION_VALUE_INVALID':
                    case 'TRANSACTION_CATEGORY_INVALID':
                    case 'TRANSACTION_DATE_INVALID':
                        request.log.warn({ code: result.code }, 'Unprocessable content');
                        return reply.status(422).send({ code: 'UNPROCESSABLE_CONTENT' });
                }
            }
            const transaction = result.data;

            request.log.info({ transactionId: transaction.id }, 'Transaction updated');
            return reply.status(200).send(TransactionMapper.toSchema(transaction));
        },
    });
};
