import { ObjectId } from 'mongodb';
import { TransactionOrchestrator } from '../../../src/application/transaction/transaction-orchestrator';
import { TransactionService } from '../../../src/domain/transaction/transaction-service';
import {
    Transaction,
    TransactionData,
    UpdateTransactionData,
} from '../../../src/domain/transaction/transaction-types';

describe('TransactionOrchestrator', () => {
    const TEST_USER_ID = new ObjectId();

    let transactionData: TransactionData;
    let updateTransactionData: UpdateTransactionData;
    let transaction: Transaction;
    let transactionArray: Transaction[];

    let transactionService: TransactionService;
    let transactionOrchestrator: TransactionOrchestrator;

    beforeEach(() => {
        transactionData = {} as unknown as TransactionData;
        updateTransactionData = {} as unknown as UpdateTransactionData;
        transaction = {} as unknown as Transaction;
        transactionArray = [transaction];

        transactionService = {
            create: jest.fn().mockResolvedValue(transaction),
            readAll: jest.fn().mockResolvedValue(transactionArray),
            update: jest.fn().mockResolvedValue(transaction),
            delete: jest.fn(),
        } as unknown as TransactionService;

        transactionOrchestrator = new TransactionOrchestrator(
            transactionService,
        );
    });

    describe('create', () => {
        it('should call transactionService to create', async () => {
            await transactionOrchestrator.create(transactionData);

            expect(transactionService.create).toHaveBeenCalledWith(
                transactionData,
            );
        });

        it('should return transaction', async () => {
            const result =
                await transactionOrchestrator.create(transactionData);

            expect(result).toEqual(transaction);
        });
    });

    describe('readAll', () => {
        it('should call transactionService to readAll', async () => {
            await transactionOrchestrator.readAll(TEST_USER_ID);

            expect(transactionService.readAll).toHaveBeenCalledWith(
                TEST_USER_ID,
            );
        });

        it('should return transaction array', async () => {
            const result = await transactionOrchestrator.readAll(TEST_USER_ID);

            expect(result).toEqual(transactionArray);
        });
    });

    describe('update', () => {
        it('should call transactionService to update', async () => {
            await transactionOrchestrator.update(
                transaction,
                updateTransactionData,
            );

            expect(transactionService.update).toHaveBeenCalledWith(
                transaction,
                updateTransactionData,
            );
        });

        it('should return transaction', async () => {
            const result = await transactionOrchestrator.update(
                transaction,
                updateTransactionData,
            );

            expect(result).toEqual(transaction);
        });
    });

    describe('delete', () => {
        it('should call transactionService to delete', async () => {
            await transactionOrchestrator.delete(transaction);

            expect(transactionService.delete).toHaveBeenCalledWith(transaction);
        });
    });
});
