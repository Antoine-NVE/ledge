import { ApiResponse } from '@shared/api/api-response.ts';
import { CreateTransactionDto } from '@shared/dto/transaction/create.dto.ts';
import { CreateTransactionSchema } from '@shared/schemas/transaction/create.schema.ts';
import { ReadAllTransactionsDto } from '@shared/dto/transaction/read-all.dto.ts';
import { ReadAllTransactionSchema } from '@shared/schemas/transaction/read-all.schema.ts';
import { ReadTransactionDto } from '@shared/dto/transaction/read.dto.ts';
import { ReadTransactionSchema } from '@shared/schemas/transaction/read.schema.ts';
import { UpdateTransactionDto } from '@shared/dto/transaction/update.dto.ts';
import { UpdateTransactionSchema } from '@shared/schemas/transaction/update.schema.ts';
import { DeleteTransactionDto } from '@shared/dto/transaction/delete.dto.ts';
import { DeleteTransactionSchema } from '@shared/schemas/transaction/delete.schema.ts';

export const createTransaction = async (
    body: CreateTransactionSchema['body'],
): Promise<ApiResponse<CreateTransactionDto, CreateTransactionSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/transactions', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const readAllTransactions = async (): Promise<ApiResponse<ReadAllTransactionsDto, ReadAllTransactionSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/transactions', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const readTransaction = async (
    params: ReadTransactionSchema['params'],
): Promise<ApiResponse<ReadTransactionDto, ReadTransactionSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/transactions/' + params.transactionId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const updateTransaction = async (
    body: UpdateTransactionSchema['body'],
    params: UpdateTransactionSchema['params'],
): Promise<ApiResponse<UpdateTransactionDto, UpdateTransactionSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/transactions/' + params.transactionId, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const deleteTransaction = async (
    params: DeleteTransactionSchema['params'],
): Promise<ApiResponse<DeleteTransactionDto, DeleteTransactionSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/transactions/' + params.transactionId, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};
