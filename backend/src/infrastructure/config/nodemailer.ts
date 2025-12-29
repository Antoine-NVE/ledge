import { createTransport, type Transporter } from 'nodemailer';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';
import type { Result } from '../../core/types/result.js';

type Input = {
    smtpUrl: string;
};

type Output = {
    smtpTransporter: Transporter;
};

export const connectToSmtp = async ({ smtpUrl }: Input): Promise<Result<Output, Error>> => {
    try {
        const smtpTransporter: Transporter = createTransport(smtpUrl);

        await smtpTransporter.verify();

        return ok({ smtpTransporter });
    } catch (err: unknown) {
        return fail(ensureError(err));
    }
};
