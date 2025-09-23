import { CookieOptions, Request, Response } from 'express';

export default class AuthCookieService {
    constructor(
        private req: Request<object, object, object, object>,
        private res: Response,
    ) {}

    private setCookie(name: string, value: string, options: CookieOptions): void {
        this.res.cookie(name, value, options);
    }

    setAccessTokenCookie(token: string, rememberMe: boolean): void {
        const maxAge = rememberMe ? 15 * 60 * 1000 : undefined; // 15 minutes

        this.setCookie('access_token', token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    }

    setRefreshTokenCookie(token: string, rememberMe: boolean): void {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

        this.setCookie('refresh_token', token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    }

    setRememberMeCookie(rememberMe: boolean): void {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

        this.setCookie('remember_me', rememberMe.toString(), {
            maxAge,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
        });
    }

    setAllAuthCookies(accessToken: string, refreshToken: string, rememberMe: boolean): void {
        this.setAccessTokenCookie(accessToken, rememberMe);
        this.setRefreshTokenCookie(refreshToken, rememberMe);
        this.setRememberMeCookie(rememberMe);
    }

    private getCookie(name: string): string | undefined {
        return this.req.cookies[name];
    }

    getAccessTokenCookie(): string | undefined {
        return this.getCookie('access_token');
    }

    getRefreshTokenCookie(): string | undefined {
        return this.getCookie('refresh_token');
    }

    getRememberMeCookie(): boolean | undefined {
        const value = this.getCookie('remember_me');
        return value === 'true' ? true : value === 'false' ? false : undefined;
    }

    private clearCookie(name: string): void {
        this.res.clearCookie(name);
    }

    clearAccessTokenCookie(): void {
        this.clearCookie('access_token');
    }

    clearRefreshTokenCookie(): void {
        this.clearCookie('refresh_token');
    }

    clearRememberMeCookie(): void {
        this.clearCookie('remember_me');
    }

    clearAllAuthCookies(): void {
        this.clearAccessTokenCookie();
        this.clearRefreshTokenCookie();
        this.clearRememberMeCookie();
    }
}
