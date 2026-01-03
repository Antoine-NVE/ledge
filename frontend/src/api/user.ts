import { ApiResponse } from '../types/apiResponse';
import { User } from '../types/user';
import { customFetch } from '../utils/customFetch';

export const getCurrentUser = async (): Promise<
    [ApiResponse<{ user: User } | null, null>, Response | null]
> => {
    try {
        const response = await customFetch(
            import.meta.env.VITE_API_URL + '/users/me',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
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
                message: 'An error occurred while fetching user data',
                data: null,
                fields: null,
            },
            null, // In this case, we didn't receive a response from the server
        ];
    }
};

export const sendVerificationEmail = async (): Promise<
    [ApiResponse<null, null>, Response | null]
> => {
    try {
        const response = await customFetch(
            import.meta.env.VITE_API_URL + '/users/request-email-verification',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    frontendBaseUrl: window.location.origin,
                }),
            },
        );

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while sending verification email',
                data: null,
                fields: null,
            },
            null,
        ]; // In this case, we didn't receive a response from the server
    }
};

export const verifyEmail = async (
    token: string,
): Promise<[ApiResponse<null, null>, Response | null]> => {
    try {
        const response = await customFetch(
            import.meta.env.VITE_API_URL + `/users/verify-email`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            },
        );

        // Can be any status code, including 200, 401, or 500
        // We will handle this in the component
        const result: ApiResponse<null, null> = await response.json();
        return [result, response];
    } catch (error: unknown) {
        console.error(error);

        return [
            {
                message: 'An error occurred while verifying email',
                data: null,
                fields: null,
            },
            null,
        ]; // In this case, we didn't receive a response from the server
    }
};
