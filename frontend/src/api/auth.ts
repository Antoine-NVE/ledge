import { ApiResponse } from '../types/apiResponse';
import { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL + '/auth';

export const login = async (
    email: string,
    password: string
): Promise<[ApiResponse<{ user: User } | null, null>, Response | null]> => {
    try {
        const response = await fetch(API_URL + '/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ user: User } | null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while logging in',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};
