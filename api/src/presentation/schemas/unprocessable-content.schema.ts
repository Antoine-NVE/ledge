import z from 'zod';

export const unprocessableContentSchema = z
    .object({
        code: z.literal('UNPROCESSABLE_CONTENT'),
    })
    .meta({ id: 'UnprocessableContent' });

export type UnprocessableContentSchema = z.output<typeof unprocessableContentSchema>;
