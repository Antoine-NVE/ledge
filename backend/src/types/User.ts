import z from 'zod';
import { userSchema } from '../schemas/UserSchema';
import { WithId } from 'mongodb';

export type User = z.infer<typeof userSchema>;
