// TODO: find a better way
type ValidationError = string[] | { [key: string]: ValidationError };

export type ApiSuccess<T> = {
    success: true;
    code: string;
    message: string;
    action?: string;
    data?: T;
};

export type ApiError = {
    success: false;
    code: string;
    message: string;
    action?: string;
    errors?: Record<string, ValidationError>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
