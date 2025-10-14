import bcrypt from 'bcrypt';

export class PasswordService {
    private readonly saltRounds = 10;

    hash = async (plain: string): Promise<string> => {
        return await bcrypt.hash(plain, this.saltRounds);
    };

    compare = async (plain: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(plain, hash);
    };
}
