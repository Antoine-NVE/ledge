export interface TokenManager {
    signAccess(payload: { userId: string }): string;
    verifyAccess(accessToken: string): { userId: string };

    signEmailVerification(payload: { userId: string }): string;
    verifyEmailVerification(emailVerificationToken: string): { userId: string };
}
