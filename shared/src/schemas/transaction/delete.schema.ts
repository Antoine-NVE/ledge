export type DeleteTransactionSchema = {
    params: {
        transactionId: string;
    };
    cookies: {
        accessToken?: string | undefined;
    };
};
