export type RefreshSchema = {
    cookies: {
        refreshToken?: string | undefined;
        rememberMe: boolean;
    };
};
