import z from 'zod';
import { UserSchema } from '../schemas/UserSchema';
import { WithId } from 'mongodb';

type UserSchemaInstance = InstanceType<typeof UserSchema>;

export type User = z.infer<UserSchemaInstance['base']>;
