export type RequestEmailVerificationSchema = {
    body: {
        frontendBaseUrl: string;
    };
    cookies: {
        accessToken?: string | undefined;
    };
};
