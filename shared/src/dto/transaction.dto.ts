export type TransactionDto = Readonly<
    | {
          id: string;
          userId: string;
          month: string;
          name: string;
          value: number;
          type: 'expense';
          expenseCategory: 'need' | 'want' | 'investment' | null;
          createdAt: string;
          updatedAt: string;
      }
    | {
          id: string;
          userId: string;
          month: string;
          name: string;
          value: number;
          type: 'income';
          expenseCategory: null;
          createdAt: string;
          updatedAt: string;
      }
>;
