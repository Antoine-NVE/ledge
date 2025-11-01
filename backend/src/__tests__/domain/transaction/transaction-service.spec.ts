import { ObjectId } from 'mongodb';
import {
    Transaction,
    TransactionData,
    TransactionUpdateData,
} from '../../../domain/transaction/transaction-types';
import { TransactionRepository } from '../../../domain/transaction/transaction-repository';
import { TransactionService } from '../../../domain/transaction/transaction-service';
import { NotFoundError } from '../../../infrastructure/errors/not-found-error';

describe('TransactionService', () => {
    const TEST_TRANSACTION_ID = new ObjectId();
    const TEST_USER_ID = new ObjectId();

    let transactionData: TransactionData;
    let transactionUpdateData: TransactionUpdateData;
    let transaction: Transaction;
    let transactionArray: Transaction[];

    let transactionRepository: TransactionRepository;
    let transactionService: TransactionService;

    beforeEach(() => {
        transactionData = {} as unknown as TransactionData;
        transactionUpdateData = {
            name: 'updated-name',
        } as unknown as TransactionUpdateData;
        transaction = {} as unknown as Transaction;
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
                    updatedAt: null,
                }),
            );
        });

        it('should return transaction', async () => {
            const result = await transactionService.create(transactionData);

            expect(result).toMatchObject({
                ...transactionData,
                updatedAt: null,
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
                transactionUpdateData,
            );

            expect(result).toMatchObject({
                ...transactionUpdateData,
            });
        });

        it('should return transaction', async () => {
            const result = await transactionService.update(
                transaction,
                transactionUpdateData,
            );

            expect(result).toEqual(transaction);
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
