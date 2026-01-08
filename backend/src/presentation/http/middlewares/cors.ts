import cors from 'cors';

export const corsMiddleware = ({ allowedOrigins }: { allowedOrigins: string[] }) => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    });
};
