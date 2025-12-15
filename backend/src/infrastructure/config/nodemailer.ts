import { createTransport, Transporter } from 'nodemailer';

export const connectToSmtp = async ({ url }: { url: string }) => {
    const transporter: Transporter = createTransport(url);
    await transporter.verify();
    return transporter;
};
