import { ApiResponse } from '@shared/api/api-response.ts';
import { RequestEmailVerificationSchema } from '@shared/schemas/user/request-email-verification.schema.ts';
import { VerifyEmailSchema } from '@shared/schemas/user/verify-email.schema.ts';
import { MeSchema } from '@shared/schemas/user/me.schema.ts';
import { UserDto } from '@shared/dto/user.dto.ts';

export const requestEmailVerification = async (
    body: RequestEmailVerificationSchema['body'],
): Promise<ApiResponse<void, RequestEmailVerificationSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/users/request-email-verification', {
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

export const verifyEmail = async (body: VerifyEmailSchema['body']): Promise<ApiResponse<void, VerifyEmailSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + `/users/verify-email`, {
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

export const me = async (): Promise<ApiResponse<UserDto, MeSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/users/me', {
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
