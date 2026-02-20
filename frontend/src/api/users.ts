import { ApiResponse } from '@shared/api/api-response.ts';
import { RequestEmailVerificationSchema } from '@shared/schemas/user/request-email-verification.schema.ts';
import { VerifyEmailSchema } from '@shared/schemas/user/verify-email.schema.ts';
import { MeSchema } from '@shared/schemas/user/me.schema.ts';
import { UserDto } from '@shared/dto/user.dto.ts';
import axios from 'axios';

const usersApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/users',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: () => true,
});

export const requestEmailVerification = async (
    body: RequestEmailVerificationSchema['body'],
): Promise<ApiResponse<void, RequestEmailVerificationSchema>> => {
    try {
        const response = await usersApi.post<ApiResponse<void, RequestEmailVerificationSchema>>(
            '/request-email-verification',
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

export const verifyEmail = async (body: VerifyEmailSchema['body']): Promise<ApiResponse<void, VerifyEmailSchema>> => {
    try {
        const response = await usersApi.post<ApiResponse<void, VerifyEmailSchema>>('/verify-email', body);
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const me = async (): Promise<ApiResponse<UserDto, MeSchema>> => {
    try {
        const response = await usersApi.get<ApiResponse<UserDto, MeSchema>>('/me');
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};
