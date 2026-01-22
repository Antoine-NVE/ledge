import type { CreateTransactionUseCase } from '../../../../application/transaction/create-transaction.use-case.js';
import type { Request, Response } from 'express';
import { createSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { CreateDto } from '../../../dto/transaction/create.dto.js';
import { toCreateDto } from '../../../mappers/transaction/create.mapper.js';
import { validateRequest } from '../../helpers/validate-request.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';

type Deps = {
    createTransactionUseCase: CreateTransactionUseCase;
    tokenManager: TokenManager;
};

export const createTransactionHandler = ({ createTransactionUseCase, tokenManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { body } = validateRequest(req, createSchema());

        const { transaction } = await createTransactionUseCase.execute({ userId, ...body });

        const response: ApiSuccess<CreateDto> = {
            success: true,
            data: toCreateDto(transaction),
        };
        res.status(201).json(response);
    };
};
