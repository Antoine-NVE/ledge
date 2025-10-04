import z from 'zod';
import { userSchema } from '../schemas/userSchema';
import { WithId } from 'mongodb';

export type UserData = z.infer<typeof userSchema>;

export type User = WithId<UserData>;

export type UserCredentials = {
    email: string;
    password: string;
};
