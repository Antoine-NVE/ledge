import c from 'cors';

export const cors = ({ allowedOrigins }: { allowedOrigins: string[] }) => {
    return c({
        origin: allowedOrigins,
        credentials: true,
    });
};
