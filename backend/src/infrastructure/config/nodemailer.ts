import { createTransport } from 'nodemailer';

export const connectToSmtp = async (options: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}) => {
    const transporter = createTransport(options);
    await transporter.verify();
    return transporter;
};
