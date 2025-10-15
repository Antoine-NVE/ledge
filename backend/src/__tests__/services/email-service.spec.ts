import nodemailer from 'nodemailer';
import { EmailService } from '../../services/EmailService';

jest.mock('nodemailer');
const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
});

describe('EmailService', () => {
    let emailService: EmailService;

    beforeEach(() => {
        jest.clearAllMocks();

        emailService = new EmailService(
            'smtp.example.com',
            587,
            false,
            { user: 'user@example.com', pass: 'password' },
            'noreply@example.com',
        );
    });

    describe('sendVerification()', () => {
        it('should send a verification email with correct parameters', async () => {
            const to = 'john@example.com';
            const frontendBaseUrl = 'https://frontend.example.com';
            const jwt = 'fake-jwt-token';

            await emailService.sendVerification(to, frontendBaseUrl, jwt);

            expect(sendMailMock).toHaveBeenCalledTimes(1);
            expect(sendMailMock).toHaveBeenCalledWith({
                from: 'noreply@example.com',
                to,
                subject: 'Please verify your email address',
                html: expect.stringContaining(
                    `${frontendBaseUrl}/verify-email/${jwt}`,
                ),
            });
        });

        it('should include the verification link and expiration info in the email', async () => {
            const to = 'jane@example.com';
            const frontendBaseUrl = 'https://frontend.example.com';
            const jwt = 'test-jwt';

            await emailService.sendVerification(to, frontendBaseUrl, jwt);

            const html = sendMailMock.mock.calls[0][0].html;

            expect(html).toContain('verify your email address');
            expect(html).toContain(`${frontendBaseUrl}/verify-email/${jwt}`);
            expect(html).toContain('expire in 1 hour');
        });
    });
});
