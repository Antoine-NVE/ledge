import cors from 'cors';

export const corsFactory = ({ allowedOrigins }: { allowedOrigins: string[] }) => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    });
};
