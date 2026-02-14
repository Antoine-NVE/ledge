import { ApiResponse } from '@shared/api/api-response.ts';
import { RegisterSchema } from '@shared/schemas/auth/register.schema.ts';
import { RegisterDto } from '@shared/dto/auth/register.dto.ts';
import { LoginSchema } from '@shared/schemas/auth/login.schema.ts';
import { LoginDto } from '@shared/dto/auth/login.dto.ts';
import { RefreshSchema } from '@shared/schemas/auth/refresh.schema.ts';
import { LogoutSchema } from '@shared/schemas/auth/logout.schema.ts';

export const register = async (body: RegisterSchema['body']): Promise<ApiResponse<RegisterDto, RegisterSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/auth/register', {
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

export const login = async (body: LoginSchema['body']): Promise<ApiResponse<LoginDto, LoginSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
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

export const refresh = async (): Promise<ApiResponse<void, RefreshSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/auth/refresh', {
            method: 'POST',
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

export const logout = async (): Promise<ApiResponse<void, LogoutSchema>> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/auth/logout', {
            method: 'POST',
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
