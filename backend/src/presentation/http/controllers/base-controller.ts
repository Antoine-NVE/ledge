import { type ZodType } from 'zod';
import { BadRequestError } from '../../../core/errors/bad-request-error.js';
import type { Request, Response } from 'express';
import { UnauthorizedError } from '../../../core/errors/unauthorized-error.js';

export abstract class BaseController {
    protected constructor() {}

    protected validate<T>(schema: ZodType<T>, data: unknown): T {
        const result = schema.safeParse(data);
        if (!result.success) throw new BadRequestError({ cause: result.error });

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

    protected getAccessToken(req: Request): string {
        const accessToken = req.cookies['access_token'];
        if (!accessToken) throw new UnauthorizedError({ message: 'Missing access token', action: 'REFRESH' });
        return accessToken;
    }

    protected findRefreshToken(req: Request): string | null {
        return req.cookies['refresh_token'] ?? null;
    }

    protected getRefreshToken(req: Request): string {
        const refreshToken = this.findRefreshToken(req);
        if (!refreshToken) throw new UnauthorizedError({ message: 'Missing refresh token', action: 'LOGIN' });
        return refreshToken;
    }

    protected getRememberMe(req: Request): boolean {
        return req.cookies['remember_me'] === 'true';
    }
}
