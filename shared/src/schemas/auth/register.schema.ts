export type RegisterSchema = {
    body: {
        email: string;
        password: string;
        confirmPassword: string;
    };
};
