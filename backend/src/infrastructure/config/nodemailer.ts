import { createTransport, type Transporter } from 'nodemailer';
import type { Env } from './env.js';

type Input = {
    smtpUrl: Env['smtpUrl'];
};

type Output = {
    smtpTransporter: Transporter;
};

export const connectToSmtp = async ({ smtpUrl }: Input): Promise<Output> => {
    const smtpTransporter: Transporter = createTransport(smtpUrl);

    await smtpTransporter.verify();

    return { smtpTransporter };
};
