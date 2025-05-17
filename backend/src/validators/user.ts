import UserModel from '../models/User';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const isEmailUnique = async (email: string): Promise<boolean> => {
    const user = await UserModel.find({ email });
    return user.length === 0;
};

export const validatePassword = (password: string): boolean => {
    const isValidLength = password.length >= 8 && password.length <= 100;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return isValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};
