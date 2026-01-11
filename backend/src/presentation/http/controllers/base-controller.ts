import { type ZodType } from 'zod';
import type { Request, Response } from 'express';
import { ValidationError } from '../../errors/validation.error.js';

export abstract class BaseController {
    protected constructor() {}

    protected validate<T>(
        req: Request,
        schema: ZodType<
            T,
            {
                body?: unknown;
                params?: unknown;
                query?: unknown;
            }
        >,
    ): T {
        const result = schema.safeParse(req);
        if (!result.success) throw new ValidationError(result.error.issues);

        return result.data;
    }

    protected setAuthCookies(res: Response, accessToken: string, refreshToken: string, rememberMe: boolean): void {
        const refreshMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined;
        const accessMaxAge = rememberMe ? 15 * 60 * 1000 : undefined;

        res.cookie('access_token', accessToken, {
            maxAge: accessMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.cookie('refresh_token', refreshToken, {
            maxAge: refreshMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.cookie('remember_me', String(rememberMe), {
            maxAge: refreshMaxAge,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
        });
    }

    protected clearAuthCookies(res: Response): void {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.clearCookie('remember_me');
    }

    protected findAccessToken(req: Request): string | null {
        return req.cookies['access_token'] ?? null;
    }

    protected findRefreshToken(req: Request): string | null {
        return req.cookies['refresh_token'] ?? null;
    }

    protected findRememberMe(req: Request): boolean {
        return req.cookies['remember_me'] === 'true';
    }
}
