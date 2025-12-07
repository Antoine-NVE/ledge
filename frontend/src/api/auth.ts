import { ApiResponse } from '../types/apiResponse';
import { User } from '../types/user';
import { customFetch } from '../utils/customFetch';

const API_URL = import.meta.env.VITE_API_URL + '/auth';

export const register = async (
    email: string,
    password: string,
    confirmPassword: string,
): Promise<[ApiResponse<{ user: User } | null, null>, Response | null]> => {
    try {
        const response = await customFetch(API_URL + '/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, confirmPassword }),
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ user: User } | null, null> =
            await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while registering',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
): Promise<[ApiResponse<{ user: User } | null, null>, Response | null]> => {
    try {
        const response = await customFetch(
            API_URL + '/login',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe }),
            },
            false, // We don't want to retry on 401 for the login endpoint
        );

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ user: User } | null, null> =
            await response.json();
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

export const refresh = async (): Promise<
    [ApiResponse<{ user: User } | null, null>, Response | null]
> => {
    try {
        const response = await customFetch(
            API_URL + '/refresh',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            false, // We don't want to retry on 401 for the refresh endpoint
        );

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<{ user: User } | null, null> =
            await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while refreshing the session',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const logout = async (): Promise<
    [ApiResponse<null, null>, Response | null]
> => {
    try {
        const response = await customFetch(API_URL + '/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while logging out',
                data: null,
                errors: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};
