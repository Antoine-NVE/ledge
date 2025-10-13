import z from 'zod';
import { WithId } from 'mongodb';
import { userSchema } from '../schemas/user';

export type User = z.infer<typeof userSchema>;
