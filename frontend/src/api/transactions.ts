import { ApiResponse } from '@shared/api/api-response.ts';
import { CreateTransactionSchema } from '@shared/schemas/transaction/create.schema.ts';
import { ReadAllTransactionSchema } from '@shared/schemas/transaction/read-all.schema.ts';
import { ReadTransactionSchema } from '@shared/schemas/transaction/read.schema.ts';
import { UpdateTransactionSchema } from '@shared/schemas/transaction/update.schema.ts';
import { DeleteTransactionSchema } from '@shared/schemas/transaction/delete.schema.ts';
import { TransactionDto } from '@shared/dto/transaction.dto.ts';
import axios from 'axios';

const transactionsApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/transactions',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: () => true,
});

export const createTransaction = async (
    body: CreateTransactionSchema['body'],
): Promise<ApiResponse<TransactionDto, CreateTransactionSchema>> => {
    try {
        const response = await transactionsApi.post<ApiResponse<TransactionDto, CreateTransactionSchema>>('', body);
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const readAllTransactions = async (): Promise<ApiResponse<TransactionDto[], ReadAllTransactionSchema>> => {
    try {
        const response = await transactionsApi.get<ApiResponse<TransactionDto[], ReadAllTransactionSchema>>('');
        return response.data;
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
        const response = await transactionsApi.get<ApiResponse<TransactionDto, ReadTransactionSchema>>(
            '/' + params.transactionId,
        );
        return response.data;
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
        const response = await transactionsApi.put<ApiResponse<TransactionDto, UpdateTransactionSchema>>(
            '/' + params.transactionId,
            body,
        );
        return response.data;
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
        const response = await transactionsApi.delete<ApiResponse<TransactionDto, DeleteTransactionSchema>>(
            '/' + params.transactionId,
        );
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};
