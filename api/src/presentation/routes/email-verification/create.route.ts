import type { FastifyPluginAsync } from 'fastify';
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import z from 'zod';
import type { RequestEmailVerificationUseCase } from '../../../application/email-verification/request-email-verification.use-case.js';
import type { AuthenticateUseCase } from '../../../application/auth/authenticate.use-case.js';
import { isAuthenticated } from '../../middlewares/is-authenticated.middleware.js';
import { unauthorizedSchema } from '../../schemas/unauthorized.schema.js';
import { activeCooldownSchema } from '../../schemas/active-cooldown.schema.js';
import { emailAlreadyVerifiedSchema } from '../../schemas/email-already-verified.schema.js';
import { badRequestSchema } from '../../schemas/bad-request.schema.js';
import { payloadTooLargeSchema } from '../../schemas/payload-too-large.schema.js';
import { tooManyRequestsSchema } from '../../schemas/too-many-requests.schema.js';
import { internalServerErrorSchema } from '../../schemas/internal-server-error.schema.js';

type Options = {
    requestEmailVerificationUseCase: RequestEmailVerificationUseCase;
    authenticateUseCase: AuthenticateUseCase;
};

export const createEmailVerificationRoute: FastifyPluginAsync<Options> = async (
    app,
    { requestEmailVerificationUseCase, authenticateUseCase },
) => {
    app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
        method: 'POST',
        url: '/email-verifications',
        schema: {
            tags: ['EmailVerification'],
            response: {
                201: { description: 'Verification email sent successfully' },
                400: badRequestSchema,
                401: unauthorizedSchema,
                409: z.union([activeCooldownSchema, emailAlreadyVerifiedSchema]),
                413: payloadTooLargeSchema,
                429: tooManyRequestsSchema,
                500: internalServerErrorSchema,
            },
        } satisfies FastifyZodOpenApiSchema,
        preHandler: isAuthenticated(authenticateUseCase),
        handler: async (request, reply) => {
            const result = await requestEmailVerificationUseCase.execute(request.session.userId);
            if (!result.success) {
                switch (result.code) {
                    case 'USER_NOT_FOUND':
                        request.log.warn({ code: result.code }, 'Unauthorized');
                        return reply.status(401).send({ code: 'UNAUTHORIZED' });
                    case 'ACTIVE_COOLDOWN':
                        request.log.warn({ code: result.code }, 'Conflict');
                        return reply.status(409).send({ code: 'ACTIVE_COOLDOWN' });
                    case 'EMAIL_ALREADY_VERIFIED':
                        request.log.warn({ code: result.code }, 'Conflict');
                        return reply.status(409).send({ code: 'EMAIL_ALREADY_VERIFIED' });
                }
            }
            const emailVerification = result.data;

            request.log.info({ emailVerificationId: emailVerification.id }, 'Email verification requested');
            return reply.status(201).send();
        },
    });
};
