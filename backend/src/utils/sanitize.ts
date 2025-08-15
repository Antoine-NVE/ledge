import { UserDocument } from '../models/User';

export function removePassword(user: UserDocument): Partial<UserDocument> {
    const userObj = user.toObject() as Partial<UserDocument>;
    delete userObj.password;
    return userObj;
}
