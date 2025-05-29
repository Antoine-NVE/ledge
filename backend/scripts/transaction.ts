import TransactionModel, { TransactionDocument } from '../src/models/Transaction';
import { UserDocument } from '../src/models/User';
import { random, pickSome } from './seed';

export const generateTransactions = async (users: UserDocument[]) => {
    await TransactionModel.deleteMany({});
    console.log('Deleted all transactions from the database');

    let allTransactions: TransactionDocument[] = [];

    for (const user of users) {
        let transactions: TransactionDocument[] = [];

        for (let i = 0; i < 12; i++) {
            const month = String(i + 1).padStart(2, '0');
            const fullMonth = `2025-${month}`;

            // Fixed incomes
            const fixedIncomes = [
                { name: 'Salaire', value: random(250000, 400000) },
                { name: 'Freelance', value: random(80000, 150000) },
                { name: 'Allocations', value: random(20000, 50000) },
            ];

            fixedIncomes.forEach((income) => {
                transactions.push(
                    new TransactionModel({
                        user: user,
                        month: fullMonth,
                        isIncome: true,
                        isFixed: true,
                        name: income.name,
                        value: income.value,
                    }),
                );
            });

            const variableIncomes = ['Prime exceptionnelle', 'Remboursement ami'];

            // Generate the transactions
            pickSome(variableIncomes).forEach((income) => {
                transactions.push(
                    new TransactionModel({
                        user: user,
                        month: fullMonth,
                        isIncome: true,
                        isFixed: false,
                        name: income,
                        value: random(10000, 100000),
                    }),
                );
            });

            // Fixed expenses
            const fixedExpenses = [
                { name: 'Loyer', value: random(60000, 100000) },
                { name: 'Assurance', value: random(20000, 40000) },
                { name: 'Netflix', value: random(1000, 2000) },
                { name: 'Internet', value: random(3000, 5000) },
            ];

            fixedExpenses.forEach((expense) => {
                transactions.push(
                    new TransactionModel({
                        user: user,
                        month: fullMonth,
                        isIncome: false,
                        isFixed: true,
                        name: expense.name,
                        value: expense.value,
                    }),
                );
            });

            // Variable expenses
            const variableExpenses = [
                'Courses',
                'Essence',
                'Resto',
                'Café',
                'Jeux vidéo',
                'Streaming',
                'Sortie',
                'Pharmacie',
                'Cadeau',
            ];

            for (let j = 0; j < random(5, 15); j++) {
                transactions.push(
                    new TransactionModel({
                        user: user,
                        month: fullMonth,
                        isIncome: false,
                        isFixed: false,
                        name: variableExpenses[random(0, variableExpenses.length - 1)],
                        value: random(500, 15000),
                    }),
                );
            }
        }

        // Insert transactions into the database for this user
        await TransactionModel.insertMany(transactions);
        allTransactions = allTransactions.concat(transactions);
    }

    return allTransactions;
};
