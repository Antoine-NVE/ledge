import * as yup from 'yup';

export const RegisterInputSchema = yup.object({
    email: yup
        .string()
        .trim()
        .lowercase()
        .required('Email is required')
        .email('Invalid email address'),

    password: yup
        .string()
        .required('Password is required')
        .test('is-trimmed', 'Password cannot start or end with whitespace', (value) => {
            return value === value.trim();
        })
        .test(
            'is-strong',
            'Password must be at least 8 characters, and include an uppercase letter, a lowercase letter, a number, and a special character',
            (value) => {
                const hasMinLength = value.length >= 8;
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                return (
                    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialCharacter
                );
            },
        ),

    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
});
