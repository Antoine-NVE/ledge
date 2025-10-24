import z from 'zod';
import { userSchema } from '../schemas/user-schemas';

export type User = z.infer<typeof userSchema>;
