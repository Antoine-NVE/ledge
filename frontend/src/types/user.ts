export interface NewUser {
    email: string;
    password: string;
}

export type User = Omit<NewUser, 'password'> & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
};
