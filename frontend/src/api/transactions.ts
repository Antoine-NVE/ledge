import { ApiResponse } from '../types/apiResponse';
import { NewTransaction, Transaction } from '../types/transaction';

const API_URL = import.meta.env.VITE_API_URL + '/transactions';

export const createTransaction = async (
    transaction: NewTransaction
): Promise<[ApiResponse<{ transaction: Transaction } | null, object | null>, Response | null]> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ transaction: Transaction } | null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while creating the transaction',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const getAllTransactions = async (): Promise<
    [ApiResponse<{ transactions: Transaction[] } | null, null>, Response | null]
> => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ transactions: Transaction[] } | null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while fetching transactions',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const getTransactionById = async (
    transaction: Transaction
): Promise<[ApiResponse<{ transaction: Transaction } | null, null>, Response | null]> => {
    try {
        const response = await fetch(API_URL + '/' + transaction._id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ transaction: Transaction } | null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while fetching the transaction',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const updateTransaction = async (
    transaction: Transaction
): Promise<[ApiResponse<{ transaction: Transaction } | null, object | null>, Response | null]> => {
    try {
        const response = await fetch(API_URL + '/' + transaction._id, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ transaction: Transaction } | null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while updating the transaction',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const deleteTransaction = async (
    transaction: Transaction
): Promise<[ApiResponse<{ transaction: Transaction } | null, null>, Response | null]> => {
    try {
        const response = await fetch(API_URL + '/' + transaction._id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ transaction: Transaction } | null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while deleting the transaction',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};
