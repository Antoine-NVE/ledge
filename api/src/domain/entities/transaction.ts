export class Transaction {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly name: string,
        public readonly value: number,
        public readonly type: 'income' | 'expense',
        public readonly category: 'need' | 'want' | 'investment' | undefined,
        public readonly date: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static create = (
        id: string,
        userId: string,
        name: string,
        value: number,
        type: 'income' | 'expense',
        category: 'need' | 'want' | 'investment' | undefined,
        date: Date,
    ) => {
        const now = new Date();

        const result = Transaction.validate(name, value, type, category, date, now);
        if (!result.success) return result;

        return {
            success: true,
            data: new Transaction(id, userId, name, value, type, category, date, now, now),
        } as const;
    };

    update = (
        name: string,
        value: number,
        type: 'income' | 'expense',
        category: 'need' | 'want' | 'investment' | undefined,
        date: Date,
    ) => {
        const now = new Date();

        const result = Transaction.validate(name, value, type, category, date, now);
        if (!result.success) return result;

        return {
            success: true,
            data: new Transaction(this.id, this.userId, name, value, type, category, date, this.createdAt, now),
        } as const;
    };

    private static validate = (
        name: string,
        value: number,
        type: 'income' | 'expense',
        category: 'need' | 'want' | 'investment' | undefined,
        date: Date,
        now: Date,
    ) => {
        if (name.length < 1 || name.length > 99) {
            return { success: false, code: 'TRANSACTION_NAME_INVALID' } as const;
        }

        // We cannot check Number.isInteger(value * 100)
        // It doesn't work with some values (ex.: 542.42) due to binary conversions
        const decimals = value.toString().split('.')[1];
        if (value < 0.01 || value > 999999999.99 || (decimals && decimals.length > 2)) {
            return { success: false, code: 'TRANSACTION_VALUE_INVALID' } as const;
        }

        // category only makes sense for an expense, and even then it stays optional
        if (type === 'income' && category !== undefined) {
            return { success: false, code: 'TRANSACTION_CATEGORY_INVALID' } as const;
        }

        // date must be a valid, UTC-midnight day between the epoch and today
        if (
            Number.isNaN(date.getTime()) ||
            !date.toISOString().endsWith('T00:00:00.000Z') ||
            date.getTime() < 0 ||
            date.getTime() > now.getTime()
        ) {
            return { success: false, code: 'TRANSACTION_DATE_INVALID' } as const;
        }

        return { success: true } as const;
    };

    static reconstitute = (
        id: string,
        userId: string,
        name: string,
        value: number,
        type: 'income' | 'expense',
        category: 'need' | 'want' | 'investment' | undefined,
        date: Date,
        createdAt: Date,
        updatedAt: Date,
    ) => {
        return new Transaction(id, userId, name, value, type, category, date, createdAt, updatedAt);
    };
}
