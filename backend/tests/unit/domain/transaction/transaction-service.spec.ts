import { TransactionRepository } from '../../../../src/domain/transaction/transaction-repository';
import { TransactionService } from '../../../../src/domain/transaction/transaction-service';
import { Transaction } from '../../../../src/domain/transaction/transaction-types';

describe('TransactionService', () => {
    const USER_ID = 'USERID123';
    const TRANSACTION_ID = 'TRANSACTIONID123';
    const MONTH = '2025-12';
    const NAME = 'name';
    const VALUE = 123;
    const TYPE = 'income';
    const EXPENSE_CATEGORY = undefined;
    const NEW_NAME = 'new-name';
    const NEW_VALUE = 456;
    const NEW_TYPE = 'expense';
    const NEW_EXPENSE_CATEGORY = 'investment';

    let transaction: Partial<Transaction>;
    let transactionArray: Partial<Transaction>[];

    let transactionRepositoryMock: TransactionRepository;

    let transactionService: TransactionService;

    beforeEach(() => {
        transaction = {
            id: TRANSACTION_ID,
        };
        transactionArray = [transaction];

        transactionRepositoryMock = {
            create: jest.fn().mockResolvedValue(transaction),
            findManyByUserId: jest.fn().mockResolvedValue(transactionArray),
            findById: jest.fn().mockResolvedValue(transaction),
            save: jest.fn(),
            deleteById: jest.fn().mockResolvedValue(transaction),
        } as unknown as TransactionRepository;
        transactionService = new TransactionService(transactionRepositoryMock);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('create', () => {
        it('should call this.transactionRepository.create', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await transactionService.create({
                userId: USER_ID,
                month: MONTH,
                name: NAME,
                value: VALUE,
                type: TYPE,
                expenseCategory: EXPENSE_CATEGORY,
            });

            expect(transactionRepositoryMock.create).toHaveBeenCalledWith({
                userId: USER_ID,
                month: MONTH,
                name: NAME,
                value: VALUE,
                type: TYPE,
                expenseCategory: EXPENSE_CATEGORY,
                createdAt: now,
            });
        });
    });

    describe('findManyByUserId', () => {
        it('should call this.transactionRepository.findManyByUserId', async () => {
            await transactionService.findManyByUserId({ userId: USER_ID });

            expect(
                transactionRepositoryMock.findManyByUserId,
            ).toHaveBeenCalledWith(USER_ID);
        });
    });

    describe('findById', () => {
        it('should call this.transactionRepository.findById', async () => {
            await transactionService.findById({ id: TRANSACTION_ID });

            expect(transactionRepositoryMock.findById).toHaveBeenCalledWith(
                TRANSACTION_ID,
            );
        });

        // it('should throw a NotFoundError if transactionRepository.findOne returns null', () => {
        //     (transactionRepository.findOne as jest.Mock).mockResolvedValue(
        //         null,
        //     );
        //
        //     expect(
        //         transactionService.read(TEST_TRANSACTION_ID),
        //     ).rejects.toThrow(NotFoundError);
        // });
    });

    describe('update', () => {
        it('should call this.transactionRepository.save', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await transactionService.update({
                transaction: transaction as Transaction,
                newName: NEW_NAME,
                newValue: NEW_VALUE,
                newType: NEW_TYPE,
                newExpenseCategory: NEW_EXPENSE_CATEGORY,
            });

            expect(transactionRepositoryMock.save).toHaveBeenCalledWith({
                id: TRANSACTION_ID,
                name: NEW_NAME,
                value: NEW_VALUE,
                type: NEW_TYPE,
                expenseCategory: NEW_EXPENSE_CATEGORY,
                updatedAt: now,
            });
        });
    });

    describe('deleteById', () => {
        it('should call this.transactionRepository.deleteById', async () => {
            await transactionService.deleteById({ id: TRANSACTION_ID });

            expect(transactionRepositoryMock.deleteById).toHaveBeenCalledWith(
                TRANSACTION_ID,
            );
        });
    });
});
