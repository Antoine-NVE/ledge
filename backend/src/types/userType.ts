import z from 'zod';
import { partialUserDataSchema, userDataSchema, userSchema } from '../schemas/userSchema';
import { WithId } from 'mongodb';

export type User = z.infer<typeof userSchema>;

export type UserData = z.infer<typeof userDataSchema>;

export type PartialUserData = z.infer<typeof partialUserDataSchema>;

export type UserCredentials = {
    email: string;
    password: string;
};
