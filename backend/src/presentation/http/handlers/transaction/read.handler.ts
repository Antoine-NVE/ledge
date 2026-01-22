import type { GetTransactionUseCase } from '../../../../application/transaction/get-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import { readSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { ReadDto } from '../../../dto/transaction/read.dto.js';
import { toReadDto } from '../../../mappers/transaction/read.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';

export type ReadTransactionDeps = {
    getTransactionUseCase: GetTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const readTransactionHandler = ({ getTransactionUseCase, tokenManager, idManager }: ReadTransactionDeps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { params } = validateRequest(req, readSchema(idManager));

        const { transaction } = await getTransactionUseCase.execute({ ...params, userId });

        const response: ApiSuccess<ReadDto> = {
            success: true,
            data: toReadDto(transaction),
        };
        res.status(200).json(response);
    };
};
