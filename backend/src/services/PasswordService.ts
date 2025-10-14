import bcrypt from 'bcrypt';

export class PasswordService {
    hash = async (plain: string): Promise<string> => {
        return await bcrypt.hash(plain, 10);
    };

    compare = async (plain: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(plain, hash);
    };
}
