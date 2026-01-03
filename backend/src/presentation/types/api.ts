export type ApiSuccess<T> = {
    success: true;
    code: string;
    message: string;
    data?: T;
};

export type ApiError = {
    success: false;
    code: string;
    message: string;
    action?: string;
    details?: {
        form: string[];
        fields: Record<string, string[]>;
    };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
