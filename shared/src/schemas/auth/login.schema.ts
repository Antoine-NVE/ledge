export type LoginSchema = {
    body: {
        email: string;
        password: string;
        rememberMe: boolean;
    };
};
