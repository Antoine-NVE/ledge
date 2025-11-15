import { Collection, ObjectId } from 'mongodb';
import { Transaction } from '../../../src/domain/transaction/transaction-types';
import { TransactionRepository } from '../../../src/domain/transaction/transaction-repository';

describe('TransactionRepository', () => {
    const TEST_OBJECT_ID = new ObjectId();

    let transaction: Transaction;
    let transactionArray: Transaction[];

    let transactionCollection: Collection<Transaction>;
    let transactionRepository: TransactionRepository;

    beforeEach(() => {
        transaction = {
            _id: TEST_OBJECT_ID,
            name: 'test-name',
        } as unknown as Transaction;
        transactionArray = [transaction];

        transactionCollection = {
            insertOne: jest.fn(),
            find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(transactionArray),
            }),
            findOne: jest.fn().mockResolvedValue(transaction),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        } as unknown as Collection<Transaction>;

        transactionRepository = new TransactionRepository(
            transactionCollection,
        );
    });

    describe('insertOne', () => {
        it('should call transactionCollection to insertOne', async () => {
            await transactionRepository.insertOne(transaction);

            expect(transactionCollection.insertOne).toHaveBeenCalledWith(
                transaction,
            );
        });
    });

    describe('find', () => {
        it('should call transactionCollection to find', async () => {
            await transactionRepository.find('_id', TEST_OBJECT_ID);

            expect(transactionCollection.find).toHaveBeenCalledWith({
                ['_id']: TEST_OBJECT_ID,
            });
        });

        it('should return transaction array', async () => {
            const result = await transactionRepository.find(
                '_id',
                TEST_OBJECT_ID,
            );

            expect(result).toEqual(transactionArray);
        });
    });

    describe('findOne', () => {
        it('should call transactionCollection to findOne', async () => {
            await transactionRepository.findOne('_id', TEST_OBJECT_ID);

            expect(transactionCollection.findOne).toHaveBeenCalledWith({
                ['_id']: TEST_OBJECT_ID,
            });
        });

        it('should return transaction', async () => {
            const result = await transactionRepository.findOne(
                '_id',
                TEST_OBJECT_ID,
            );

            expect(result).toEqual(transaction);
        });
    });

    describe('updateOne', () => {
        it('should call transactionCollection to updateOne', async () => {
            transaction.type = 'expense';

            // Always true, only here to stop TypeScript errors
            if (transaction.type === 'expense') {
                transaction.expenseCategory = 'need';
            }

            await transactionRepository.updateOne(transaction);

            const { _id, ...rest } = transaction;

            expect(transactionCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest },
            );
        });

        it('should delete expenseCategory if not present in input transaction', async () => {
            await transactionRepository.updateOne(transaction); // Here transaction does not possess expenseCategory

            const { _id, ...rest } = transaction;

            expect(transactionCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest, $unset: { expenseCategory: '' } },
            );
        });
    });

    describe('deleteOne', () => {
        it('should call transactionCollection to deleteOne', async () => {
            await transactionRepository.deleteOne('_id', TEST_OBJECT_ID);

            expect(transactionCollection.deleteOne).toHaveBeenCalledWith({
                ['_id']: TEST_OBJECT_ID,
            });
        });
    });
});
