import { ApiResponse } from '@shared/api/api-response.ts';
import { RegisterSchema } from '@shared/schemas/auth/register.schema.ts';
import { LoginSchema } from '@shared/schemas/auth/login.schema.ts';
import { RefreshSchema } from '@shared/schemas/auth/refresh.schema.ts';
import { LogoutSchema } from '@shared/schemas/auth/logout.schema.ts';
import { UserDto } from '@shared/dto/user.dto.ts';
import axios from 'axios';

const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/auth',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: () => true,
});

export const register = async (body: RegisterSchema['body']): Promise<ApiResponse<UserDto, RegisterSchema>> => {
    try {
        const response = await authApi.post<ApiResponse<UserDto, RegisterSchema>>('/register', body);
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const login = async (body: LoginSchema['body']): Promise<ApiResponse<UserDto, LoginSchema>> => {
    try {
        const response = await authApi.post<ApiResponse<UserDto, LoginSchema>>('/login', body);
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const refresh = async (): Promise<ApiResponse<void, RefreshSchema>> => {
    try {
        const response = await authApi.post<ApiResponse<void, RefreshSchema>>('/refresh');
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const logout = async (): Promise<ApiResponse<void, LogoutSchema>> => {
    try {
        const response = await authApi.post<ApiResponse<void, LogoutSchema>>('/logout');
        return response.data;
    } catch {
        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};
