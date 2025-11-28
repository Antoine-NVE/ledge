export interface EmailSender {
    sendVerification: (
        options: {
            from: string;
            to: string;
        },
        frontendBaseUrl: string,
        token: string,
    ) => Promise<void>;
}
