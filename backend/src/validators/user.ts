import UserModel, { UserDocument } from '../models/User';

export const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export async function isEmailUnique(this: UserDocument, email: string): Promise<boolean> {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) return true;

    // If the existing user is the same as the current user, consider it unique
    return existingUser._id.equals(this._id);
}

export const isPasswordValid = (password: string): boolean => {
    const isValidLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return isValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};
