import { AuthController } from '../../presentation/auth/auth-controller';
import { UserController } from '../../presentation/user/user-controller';
import { TransactionController } from '../../presentation/transaction/transaction-controller';
import { JwtService } from '../services/jwt-service';
import { UserService } from '../../domain/user/user-service';
import { TransactionService } from '../../domain/transaction/transaction-service';

export type Container = {
    authController: AuthController;
    userController: UserController;
    transactionController: TransactionController;
    jwtService: JwtService;
    userService: UserService;
    transactionService: TransactionService;
};
