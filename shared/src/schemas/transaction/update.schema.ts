export type UpdateTransactionSchema = {
    body:
        | {
              name: string;
              value: number;
              type: 'expense';
              expenseCategory: 'need' | 'want' | 'investment' | null;
          }
        | {
              name: string;
              value: number;
              type: 'income';
              expenseCategory: null;
          };
    params: {
        transactionId: string;
    };
    cookies: {
        accessToken?: string | undefined;
    };
};
