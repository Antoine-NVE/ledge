export type SignAccessPayload = {
    userId: string;
};

export type VerificationEmailPayload = {
    userId: string;
};

export interface TokenManager {
    signAccess(payload: SignAccessPayload): string;
    verifyAccess(token: string): SignAccessPayload;

    signVerificationEmail(payload: VerificationEmailPayload): string;
    verifyVerificationEmail(token: string): VerificationEmailPayload;
}
