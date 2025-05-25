import { ApiResponse } from '../types/apiResponse';
import { Transaction } from '../types/transaction';

export const getAllTransactions = async (): Promise<
    [ApiResponse<{ transactions: Transaction[] } | null, null>, Response | null]
> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/transactions', {
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
