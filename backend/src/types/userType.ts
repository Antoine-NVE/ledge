import z from 'zod';
import { userSchema } from '../schemas/userSchema';
import { WithId } from 'mongodb';

export type User = z.infer<typeof userSchema>;
