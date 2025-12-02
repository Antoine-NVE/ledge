import cors from 'cors';

export const createCors = (allowedOrigins: string[]) => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    });
};
