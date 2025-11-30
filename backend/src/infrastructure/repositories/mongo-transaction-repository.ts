import { Collection, ObjectId } from 'mongodb';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import {
    NewTransaction,
    Transaction,
} from '../../domain/transaction/transaction-types';

type IncomeDocument = {
    _id: ObjectId;
    userId: ObjectId;
    month: string;
    name: string;
    value: number;
    type: 'income';
    expenseCategory: undefined;
    createdAt: Date;
    updatedAt?: Date;
};

type ExpenseDocument = {
    _id: ObjectId;
    userId: ObjectId;
    month: string;
    name: string;
    value: number;
    type: 'expense';
    expenseCategory: 'need' | 'want' | 'investment' | null;
    createdAt: Date;
    updatedAt?: Date;
};

type TransactionDocument = IncomeDocument | ExpenseDocument;

export class MongoTransactionRepository implements TransactionRepository {
    constructor(
        private transactionCollection: Collection<TransactionDocument>,
    ) {}

    private toDomain({
        _id,
        userId,
        month,
        name,
        value,
        type,
        expenseCategory,
        createdAt,
        updatedAt,
    }: TransactionDocument): Transaction {
        switch (type) {
            case 'income':
                return {
                    id: _id.toString(),
                    userId: userId.toString(),
                    month,
                    name,
                    value,
                    type,
                    expenseCategory,
                    createdAt,
                    updatedAt,
                };

            case 'expense':
                return {
                    id: _id.toString(),
                    userId: userId.toString(),
                    month,
                    name,
                    value,
                    type,
                    expenseCategory,
                    createdAt,
                    updatedAt,
                };
        }
    }

    create = async ({
        userId,
        month,
        name,
        value,
        type,
        expenseCategory,
        createdAt,
        updatedAt,
    }: NewTransaction) => {
        let document: TransactionDocument;
        switch (type) {
            case 'income':
                document = {
                    _id: new ObjectId(),
                    userId: new ObjectId(userId),
                    month,
                    name,
                    value,
                    type,
                    expenseCategory,
                    createdAt,
                    updatedAt,
                };
                break;

            case 'expense':
                document = {
                    _id: new ObjectId(),
                    userId: new ObjectId(userId),
                    month,
                    name,
                    value,
                    type,
                    expenseCategory,
                    createdAt,
                    updatedAt,
                };
                break;
        }
        await this.transactionCollection.insertOne(document);
        return this.toDomain(document);
    };

    findManyByUserId = async (userId: string) => {
        const documents = await this.transactionCollection
            .find({ userId: new ObjectId(userId) })
            .toArray();
        return documents.map((document) => this.toDomain(document));
    };

    findById = async (id: string) => {
        const document = await this.transactionCollection.findOne({
            _id: new ObjectId(id),
        });
        return document ? this.toDomain(document) : null;
    };

    save = async ({
        id,
        name,
        value,
        type,
        expenseCategory,
        updatedAt,
    }: Transaction) => {
        switch (type) {
            case 'income':
                await this.transactionCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            name,
                            value,
                            type,
                            expenseCategory,
                            updatedAt,
                        },
                    },
                );
                break;

            case 'expense':
                await this.transactionCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            name,
                            value,
                            type,
                            expenseCategory,
                            updatedAt,
                        },
                    },
                );
                break;
        }
    };

    deleteById = async (id: string) => {
        const document = await this.transactionCollection.findOneAndDelete({
            _id: new ObjectId(id),
        });
        return document ? this.toDomain(document) : null;
    };
}
