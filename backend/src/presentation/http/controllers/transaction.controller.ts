import type { Request, Response } from 'express';
import type { CreateTransactionUseCase } from '../../../application/transaction/create-transaction.use-case.js';
import type { GetUserTransactionsUseCase } from '../../../application/transaction/get-user-transactions.use-case.js';
import type { GetTransactionUseCase } from '../../../application/transaction/get-transaction.use-case.js';
import type { UpdateTransactionUseCase } from '../../../application/transaction/update-transaction.use-case.js';
import type { DeleteTransactionUseCase } from '../../../application/transaction/delete-transaction.use-case.js';
import type { TokenManager } from '../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../domain/ports/id-manager.js';
import type { ApiSuccess } from '../../types/api-response.js';
import { AuthenticatedController } from './authenticated.controller.js';
import { createSchema, deleteSchema, readSchema, updateSchema } from '../../schemas/transaction.schemas.js';
import type { CreateDto } from '../../dto/transaction/create.dto.js';
import { toCreateDto } from '../../mappers/transaction/create.mapper.js';
import type { ReadAllDto } from '../../dto/transaction/read-all.dto.js';
import { toReadAllDto } from '../../mappers/transaction/read-all.mapper.js';
import type { ReadDto } from '../../dto/transaction/read.dto.js';
import { toReadDto } from '../../mappers/transaction/read.mapper.js';
import type { UpdateDto } from '../../dto/transaction/update.dto.js';
import { toUpdateDto } from '../../mappers/transaction/update.mapper.js';
import type { DeleteDto } from '../../dto/transaction/delete.dto.js';
import { toDeleteDto } from '../../mappers/transaction/delete.mapper.js';

export class TransactionController extends AuthenticatedController {
    constructor(
        tokenManager: TokenManager,
        private idManager: IdManager,
        private createTransactionUseCase: CreateTransactionUseCase,
        private getUserTransactionsUseCase: GetUserTransactionsUseCase,
        private getTransactionUseCase: GetTransactionUseCase,
        private updateTransactionUseCase: UpdateTransactionUseCase,
        private deleteTransactionUseCase: DeleteTransactionUseCase,
    ) {
        super(tokenManager);
    }

    create = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { body } = this.validate(req, createSchema());

        const { transaction } = await this.createTransactionUseCase.execute({ userId, ...body });

        const response: ApiSuccess<CreateDto> = {
            success: true,
            data: toCreateDto(transaction),
        };
        res.status(201).json(response);
    };

    readAll = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { transactions } = await this.getUserTransactionsUseCase.execute({ userId });

        const response: ApiSuccess<ReadAllDto> = {
            success: true,
            data: toReadAllDto(transactions),
        };
        res.status(200).json(response);
    };

    read = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { params } = this.validate(req, readSchema(this.idManager));

        const { transaction } = await this.getTransactionUseCase.execute({ ...params, userId });

        const response: ApiSuccess<ReadDto> = {
            success: true,
            data: toReadDto(transaction),
        };
        res.status(200).json(response);
    };

    update = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { body, params } = this.validate(req, updateSchema(this.idManager));

        const { transaction } = await this.updateTransactionUseCase.execute({ ...params, userId, ...body });

        const response: ApiSuccess<UpdateDto> = {
            success: true,
            data: toUpdateDto(transaction),
        };
        res.status(200).json(response);
    };

    delete = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { params } = this.validate(req, deleteSchema(this.idManager));

        const { transaction } = await this.deleteTransactionUseCase.execute({ ...params, userId });

        const response: ApiSuccess<DeleteDto> = {
            success: true,
            data: toDeleteDto(transaction),
        };
        res.status(200).json(response);
    };
}
