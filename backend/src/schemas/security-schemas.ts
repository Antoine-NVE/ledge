import { ObjectId } from 'mongodb';
import z from 'zod';
import { env } from '../config/env';

export const objectIdSchema = z
    .string()
    .refine((val) => ObjectId.isValid(val))
    .transform((val) => new ObjectId(val));

export const allowedOriginSchema = z
    .url()
    .refine((val) => env.ALLOWED_ORIGINS.includes(val));

export const jwtSchema = z.jwt();
