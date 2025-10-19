import { Transporter, createTransport } from 'nodemailer';

export class EmailService {
    private transporter: Transporter;
    private from: string;

    constructor(
        host: string,
        port: number,
        secure: boolean,
        auth: { user: string; pass: string },
        from: string,
    ) {
        this.transporter = createTransport({ host, port, secure, auth });
        this.from = from;
    }

    private send = async (
        to: string,
        subject: string,
        html: string,
    ): Promise<void> => {
        await this.transporter.sendMail({ from: this.from, to, subject, html });
    };

    sendVerification = async (
        to: string,
        frontendBaseUrl: string,
        jwt: string,
    ): Promise<void> => {
        const subject = 'Please verify your email address';
        const html = `Click here to verify your email address: <a href="${frontendBaseUrl}/verify-email/${jwt}">verify email</a>. This link will expire in 1 hour.`;

        await this.send(to, subject, html);
    };
}
