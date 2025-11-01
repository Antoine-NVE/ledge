import { ObjectId } from 'mongodb';
import { TransactionOrchestrator } from '../../../application/transaction/transaction-orchestrator';
import { TransactionService } from '../../../domain/transaction/transaction-service';
import {
    Transaction,
    TransactionData,
    TransactionUpdateData,
} from '../../../domain/transaction/transaction-types';

describe('TransactionOrchestrator', () => {
    const TEST_ID = new ObjectId();
    const TEST_USER_ID = new ObjectId();

    let transactionData: TransactionData;
    let transactionUpdateData: TransactionUpdateData;
    let transaction: Transaction;
    let transactionArray: Transaction[];

    let transactionService: TransactionService;
    let transactionOrchestrator: TransactionOrchestrator;

    beforeEach(() => {
        transactionData = {} as unknown as TransactionData;
        transactionUpdateData = {} as unknown as TransactionUpdateData;
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
                transactionUpdateData,
            );

            expect(transactionService.update).toHaveBeenCalledWith(
                transaction,
                transactionUpdateData,
            );
        });

        it('should return transaction', async () => {
            const result = await transactionOrchestrator.update(
                transaction,
                transactionUpdateData,
            );

            expect(result).toEqual(transaction);
        });
    });

    describe('delete', () => {
        it('should call transactionService to delete', async () => {
            await transactionOrchestrator.delete(TEST_ID);

            expect(transactionService.delete).toHaveBeenCalledWith(TEST_ID);
        });
    });
});
