import { Transporter, createTransport } from 'nodemailer';

export class EmailService {
    private transporter: Transporter;

    constructor(options: {
        host: string;
        port: number;
        secure: boolean;
        auth: { user: string; pass: string };
    }) {
        this.transporter = createTransport(options);
    }

    private send = async (
        from: string,
        to: string,
        subject: string,
        html: string,
    ): Promise<void> => {
        await this.transporter.sendMail({ from, to, subject, html });
    };

    sendVerification = async (
        from: string,
        to: string,
        frontendBaseUrl: string,
        jwt: string,
    ): Promise<void> => {
        const subject = 'Please verify your email address';
        const html = `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${jwt}">verify email</a>. This link will expire in 1 hour.`;

        await this.send(from, to, subject, html);
    };
}
