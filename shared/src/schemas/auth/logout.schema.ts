export type LogoutSchema = {
    cookies: {
        refreshToken?: string | undefined;
    };
};
