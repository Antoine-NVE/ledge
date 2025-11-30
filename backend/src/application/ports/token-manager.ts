export interface TokenManager {
    signAccess(userId: string): string;
    verifyAccess(token: string): { userId: string };

    signVerificationEmail(userId: string): string;
    verifyVerificationEmail(token: string): { userId: string };
}
