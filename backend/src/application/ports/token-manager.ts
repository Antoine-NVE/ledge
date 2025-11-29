export interface TokenManager {
    signAccess(userId: string): string;
    verifyAccess(token: string): string;

    signVerificationEmail(userId: string): string;
    verifyVerificationEmail(token: string): string;
}
