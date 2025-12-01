import { createTransport, Transporter } from 'nodemailer';

export const connectToSmtp = async (options: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}) => {
    const transporter: Transporter = createTransport(options);
    await transporter.verify();
    return { transporter };
};
