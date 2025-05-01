import mongoose from 'mongoose';
import TransactionModel, { ITransaction } from '../src/models/Transaction';

(async () => {
    try {
        const mongoUri = 'mongodb://ledge-database:27017/ledge';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing transactions
        await TransactionModel.deleteMany({});
        console.log('Cleared existing transactions');

        const transactions: ITransaction[] = [];

        // Helpers
        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const pickSome = <T>(array: T[]): T[] => {
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            const count = Math.floor(Math.random() * (array.length + 1));
            return shuffled.slice(0, count);
        };

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
                        month: fullMonth,
                        isIncome: true,
                        isFixed: true,
                        name: income.name,
                        value: income.value,
                    })
                );
            });

            const variableIncomes = ['Prime exceptionnelle', 'Remboursement ami'];

            // Generate the transactions
            pickSome(variableIncomes).forEach((income) => {
                transactions.push(
                    new TransactionModel({
                        month: fullMonth,
                        isIncome: true,
                        isFixed: false,
                        name: income,
                        value: random(10000, 100000),
                    })
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
                        month: fullMonth,
                        isIncome: false,
                        isFixed: true,
                        name: expense.name,
                        value: expense.value,
                    })
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
                        month: fullMonth,
                        isIncome: false,
                        isFixed: false,
                        name: variableExpenses[random(0, variableExpenses.length - 1)],
                        value: random(500, 15000),
                    })
                );
            }
        }

        // Insert transactions into the database
        await TransactionModel.insertMany(transactions);
        console.log(`Inserted ${transactions.length} transactions`);

        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();
