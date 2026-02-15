import { ApiResponse } from '@shared/api/api-response.ts';
import { CreateTransactionSchema } from '@shared/schemas/transaction/create.schema.ts';
import { ReadAllTransactionSchema } from '@shared/schemas/transaction/read-all.schema.ts';
import { ReadTransactionSchema } from '@shared/schemas/transaction/read.schema.ts';
import { UpdateTransactionSchema } from '@shared/schemas/transaction/update.schema.ts';
import { DeleteTransactionSchema } from '@shared/schemas/transaction/delete.schema.ts';
import { TransactionDto } from '@shared/dto/transaction.dto.ts';

export const createTransaction = async (
    body: CreateTransactionSchema['body'],
): Promise<ApiResponse<TransactionDto, CreateTransactionSchema>> => {
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

export const readAllTransactions = async (): Promise<ApiResponse<TransactionDto[], ReadAllTransactionSchema>> => {
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
): Promise<ApiResponse<TransactionDto, ReadTransactionSchema>> => {
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
): Promise<ApiResponse<TransactionDto, UpdateTransactionSchema>> => {
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
): Promise<ApiResponse<TransactionDto, DeleteTransactionSchema>> => {
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
