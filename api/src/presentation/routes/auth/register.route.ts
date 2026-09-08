import type { FastifyPluginAsync } from 'fastify';
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import z from 'zod';
import type { RegisterUseCase } from '../../../application/auth/register.use-case.js';
import { userSchema } from '../../schemas/user.schema.js';
import { duplicateEmailSchema } from '../../schemas/duplicate-email.schema.js';
import { badRequestSchema } from '../../schemas/bad-request.schema.js';
import { payloadTooLargeSchema } from '../../schemas/payload-too-large.schema.js';
import { tooManyRequestsSchema } from '../../schemas/too-many-requests.schema.js';
import { internalServerErrorSchema } from '../../schemas/internal-server-error.schema.js';
import { unprocessableContentSchema } from '../../schemas/unprocessable-content.schema.js';
import { UserMapper } from '../../mappers/user.mapper.js';

type Options = {
    registerUseCase: RegisterUseCase;
};

export const registerRoute: FastifyPluginAsync<Options> = async (app, { registerUseCase }) => {
    app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
        method: 'POST',
        url: '/auth/register',
        schema: {
            tags: ['Auth'],
            body: z.object({
                email: z.string(),
                password: z.string(),
            }),
            response: {
                201: userSchema,
                400: badRequestSchema,
                409: duplicateEmailSchema,
                413: payloadTooLargeSchema,
                422: unprocessableContentSchema,
                429: tooManyRequestsSchema,
                500: internalServerErrorSchema,
            },
        } satisfies FastifyZodOpenApiSchema,
        handler: async (request, reply) => {
            const { email, password } = request.body;

            const result = await registerUseCase.execute(email, password);
            if (!result.success) {
                switch (result.code) {
                    case 'DUPLICATE_EMAIL':
                        request.log.warn({ code: result.code }, 'Conflict');
                        return reply.status(409).send({ code: 'DUPLICATE_EMAIL' });
                    case 'INVALID_EMAIL':
                    case 'WEAK_PASSWORD':
                        request.log.warn({ code: result.code }, 'Unprocessable content');
                        return reply.status(422).send({ code: 'UNPROCESSABLE_CONTENT' });
                }
            }
            const { user, ...session } = result.data;

            reply.setCookie('session_token', session.token, {
                expires: session.expiresAt,
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            request.log.info({ sessionId: session.id, userId: user.id }, 'User registered');
            return reply.status(201).send(UserMapper.toSchema(user));
        },
    });
};
