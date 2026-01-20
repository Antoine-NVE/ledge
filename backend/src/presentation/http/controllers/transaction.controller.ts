import type { Request, Response } from 'express';
import type { CreateTransactionUseCase } from '../../../application/transaction/create-transaction.use-case.js';
import type { GetUserTransactionsUseCase } from '../../../application/transaction/get-user-transactions.use-case.js';
import type { GetTransactionUseCase } from '../../../application/transaction/get-transaction.use-case.js';
import type { UpdateTransactionUseCase } from '../../../application/transaction/update-transaction.use-case.js';
import type { DeleteTransactionUseCase } from '../../../application/transaction/delete-transaction.use-case.js';
import type { TokenManager } from '../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../domain/ports/id-manager.js';
import type { ApiError, ApiSuccess } from '../../types/api-response.js';
import { AuthenticatedController } from './authenticated.controller.js';
import { createSchema, deleteSchema, readSchema, updateSchema } from '../schemas/transaction.schemas.js';
import { AuthorizationError } from '../../../application/errors/authorization.error.js';
import { ResourceNotFoundError } from '../../../application/errors/resource-not-found.error.js';
import { ValidationError } from '../../errors/validation.error.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import z from 'zod';
import type { CreateDto } from '../dto/transaction/create.dto.js';
import type { ReadAllDto } from '../dto/transaction/read-all.dto.js';
import { toCreateDto } from '../mappers/transaction/create.mapper.js';
import { toReadAllDto } from '../mappers/transaction/read-all.mapper.js';
import { toReadDto } from '../mappers/transaction/read.mapper.js';
import { toUpdateDto } from '../mappers/transaction/update.mapper.js';
import { toDeleteDto } from '../mappers/transaction/delete.mapper.js';
import type { ReadDto } from '../dto/transaction/read.dto.js';
import type { UpdateDto } from '../dto/transaction/update.dto.js';
import type { DeleteDto } from '../dto/transaction/delete.dto.js';

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
        try {
            const userId = this.getUserId(req);

            const { body } = this.validate(req, createSchema());

            const { transaction } = await this.createTransactionUseCase.execute({ userId, ...body });

            const response: ApiSuccess<CreateDto> = {
                success: true,
                data: toCreateDto(transaction),
            };
            res.status(201).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError<z.infer<ReturnType<typeof createSchema>>> = {
                    success: false,
                    code: err.code,
                    tree: err.tree,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(401).json(response);
                return;
            }
            throw err;
        }
    };

    readAll = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserId(req);

            const { transactions } = await this.getUserTransactionsUseCase.execute({ userId });

            const response: ApiSuccess<ReadAllDto> = {
                success: true,
                data: toReadAllDto(transactions),
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(401).json(response);
                return;
            }
            throw err;
        }
    };

    read = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserId(req);

            const { params } = this.validate(req, readSchema(this.idManager));

            const { transaction } = await this.getTransactionUseCase.execute({ ...params, userId });

            const response: ApiSuccess<ReadDto> = {
                success: true,
                data: toReadDto(transaction),
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError<z.infer<ReturnType<typeof readSchema>>> = {
                    success: false,
                    code: err.code,
                    tree: err.tree,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(401).json(response);
                return;
            }
            if (err instanceof AuthorizationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(403).json(response);
                return;
            }
            if (err instanceof ResourceNotFoundError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(404).json(response);
                return;
            }
            throw err;
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserId(req);

            const { body, params } = this.validate(req, updateSchema(this.idManager));

            const { transaction } = await this.updateTransactionUseCase.execute({ ...params, userId, ...body });

            const response: ApiSuccess<UpdateDto> = {
                success: true,
                data: toUpdateDto(transaction),
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError<z.infer<ReturnType<typeof updateSchema>>> = {
                    success: false,
                    code: err.code,
                    tree: err.tree,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(401).json(response);
                return;
            }
            if (err instanceof AuthorizationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(403).json(response);
                return;
            }
            if (err instanceof ResourceNotFoundError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(404).json(response);
                return;
            }
            throw err;
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserId(req);

            const { params } = this.validate(req, deleteSchema(this.idManager));

            const { transaction } = await this.deleteTransactionUseCase.execute({ ...params, userId });

            const response: ApiSuccess<DeleteDto> = {
                success: true,
                data: toDeleteDto(transaction),
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError<z.infer<ReturnType<typeof deleteSchema>>> = {
                    success: false,
                    code: err.code,
                    tree: err.tree,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(401).json(response);
                return;
            }
            if (err instanceof AuthorizationError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(403).json(response);
                return;
            }
            if (err instanceof ResourceNotFoundError) {
                const response: ApiError = {
                    success: false,
                    code: err.code,
                };
                res.status(404).json(response);
                return;
            }
            throw err;
        }
    };
}
