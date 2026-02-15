import { createTransport, type Transporter } from 'nodemailer';
import { fail, ok, type Result } from '../../core/result.js';
import type { Env } from './env.js';

type Input = {
    smtpUrl: Env['smtpUrl'];
};

type Output = {
    smtpTransporter: Transporter;
};

export const connectToSmtp = async ({ smtpUrl }: Input): Promise<Result<Output, unknown>> => {
    try {
        const smtpTransporter: Transporter = createTransport(smtpUrl);

        await smtpTransporter.verify();

        return ok({ smtpTransporter });
    } catch (err: unknown) {
        return fail(err);
    }
};
