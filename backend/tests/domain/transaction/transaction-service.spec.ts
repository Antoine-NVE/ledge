import { ObjectId } from 'mongodb';
import {
    Transaction,
    TransactionData,
    UpdateTransactionData,
} from '../../../src/domain/transaction/transaction-types';
import { TransactionRepository } from '../../../src/domain/transaction/transaction-repository';
import { TransactionService } from '../../../src/domain/transaction/transaction-service';
import { NotFoundError } from '../../../src/infrastructure/errors/not-found-error';

describe('TransactionService', () => {
    const TEST_TRANSACTION_ID = new ObjectId();
    const TEST_USER_ID = new ObjectId();
    const TRANSACTION_ID = new ObjectId();

    let transactionData: TransactionData;
    let updateTransactionData: UpdateTransactionData;
    let transaction: Transaction;
    let transactionArray: Transaction[];

    let transactionRepository: TransactionRepository;
    let transactionService: TransactionService;

    beforeEach(() => {
        transactionData = {} as unknown as TransactionData;
        updateTransactionData = {
            name: 'updated-name',
        } as unknown as UpdateTransactionData;
        transaction = {
            _id: TRANSACTION_ID,
        } as unknown as Transaction;
        transactionArray = [transaction];

        transactionRepository = {
            insertOne: jest.fn(),
            find: jest.fn().mockResolvedValue(transactionArray),
            findOne: jest.fn().mockResolvedValue(transaction),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        } as unknown as TransactionRepository;
        transactionService = new TransactionService(transactionRepository);
    });

    describe('create', () => {
        it('should call transactionRepository to insertOne', async () => {
            await transactionService.create(transactionData);

            expect(transactionRepository.insertOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...transactionData,
                }),
            );
        });

        it('should return transaction', async () => {
            const result = await transactionService.create(transactionData);

            expect(result).toMatchObject({
                ...transactionData,
            });
        });
    });

    describe('readAll', () => {
        it('should call transactionRepository to find', async () => {
            await transactionService.readAll(TEST_USER_ID);

            expect(transactionRepository.find).toHaveBeenCalledWith(
                'userId',
                TEST_USER_ID,
            );
        });

        it('should return transaction array', async () => {
            const result = await transactionService.readAll(TEST_USER_ID);

            expect(result).toEqual(transactionArray);
        });
    });

    describe('read', () => {
        it('should call transactionRepository.findOne', async () => {
            await transactionService.read(TEST_TRANSACTION_ID);

            expect(transactionRepository.findOne).toHaveBeenCalledWith(
                '_id',
                TEST_TRANSACTION_ID,
            );
        });

        it('should throw a NotFoundError if transactionRepository.findOne returns null', () => {
            (transactionRepository.findOne as jest.Mock).mockResolvedValue(
                null,
            );

            expect(
                transactionService.read(TEST_TRANSACTION_ID),
            ).rejects.toThrow(NotFoundError);
        });

        it('should return transaction', async () => {
            const result = await transactionService.read(TEST_TRANSACTION_ID);

            expect(result).toEqual(transaction);
        });
    });

    describe('update', () => {
        it('should update values', async () => {
            const result = await transactionService.update(
                transaction,
                updateTransactionData,
            );

            expect(result).toMatchObject({
                ...updateTransactionData,
            });
        });

        it('should return an updated transaction', async () => {
            const result = await transactionService.update(
                transaction,
                updateTransactionData,
            );

            expect(result).toMatchObject({
                ...transaction,
                ...updateTransactionData,
            });
        });
    });

    describe('delete', () => {
        it('should call transactionRepository.deleteOne', async () => {
            await transactionService.delete(TEST_TRANSACTION_ID);

            expect(transactionRepository.deleteOne).toHaveBeenCalledWith(
                '_id',
                TEST_TRANSACTION_ID,
            );
        });
    });
});
