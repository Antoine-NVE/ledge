export type ReadTransactionSchema = {
    params: {
        transactionId: string;
    };
    cookies: {
        accessToken?: string | undefined;
    };
};
