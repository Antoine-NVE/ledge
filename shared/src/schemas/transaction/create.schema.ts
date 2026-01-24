export type CreateTransactionSchema = {
    body:
        | {
              month: string;
              name: string;
              value: number;
              type: 'expense';
              expenseCategory: 'need' | 'want' | 'investment' | null;
          }
        | {
              month: string;
              name: string;
              value: number;
              type: 'income';
              expenseCategory: null;
          };
};
