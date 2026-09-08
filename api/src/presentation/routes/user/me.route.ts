import type { FastifyPluginAsync } from 'fastify';
import type { FastifyZodOpenApiSchema, FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import type { GetCurrentUserUseCase } from '../../../application/user/get-current-user.use-case.js';
import type { AuthenticateUseCase } from '../../../application/auth/authenticate.use-case.js';
import { isAuthenticated } from '../../middlewares/is-authenticated.middleware.js';
import { userSchema } from '../../schemas/user.schema.js';
import { unauthorizedSchema } from '../../schemas/unauthorized.schema.js';
import { tooManyRequestsSchema } from '../../schemas/too-many-requests.schema.js';
import { internalServerErrorSchema } from '../../schemas/internal-server-error.schema.js';
import { UserMapper } from '../../mappers/user.mapper.js';

type Options = {
    getCurrentUserUseCase: GetCurrentUserUseCase;
    authenticateUseCase: AuthenticateUseCase;
};

export const meRoute: FastifyPluginAsync<Options> = async (app, { getCurrentUserUseCase, authenticateUseCase }) => {
    app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
        method: 'GET',
        url: '/users/me',
        schema: {
            tags: ['User'],
            response: {
                200: userSchema,
                401: unauthorizedSchema,
                429: tooManyRequestsSchema,
                500: internalServerErrorSchema,
            },
        } satisfies FastifyZodOpenApiSchema,
        preHandler: isAuthenticated(authenticateUseCase),
        handler: async (request, reply) => {
            const result = await getCurrentUserUseCase.execute(request.session.userId);
            if (!result.success) {
                switch (result.code) {
                    case 'USER_NOT_FOUND':
                        request.log.warn({ code: result.code }, 'Unauthorized');
                        return reply.status(401).send({ code: 'UNAUTHORIZED' });
                }
            }
            const user = result.data;

            return reply.status(200).send(UserMapper.toSchema(user));
        },
    });
};
