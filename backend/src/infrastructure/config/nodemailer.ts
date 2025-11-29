import { createTransport } from 'nodemailer';

export const connectToSmtp = async ({
    host,
    port,
    secure,
    auth,
}: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}) => {
    const transporter = createTransport({
        host,
        port,
        secure,
        auth,
    });
    await transporter.verify();
    return transporter;
};
