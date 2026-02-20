import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { $ZodErrorTree } from 'zod/v4/core';
import { register } from '../api/auth';
import type { RegisterSchema } from '@shared/schemas/auth/register.schema';
import { useAuth } from '../hooks/useAuth.ts';

const Register = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<$ZodErrorTree<RegisterSchema['body']> | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors(null);

        const response = await register({ email, password, confirmPassword });

        setIsLoading(false);

        if (response.success) {
            setUser(response.data);
            navigate('/');
        } else {
            if (response.code === 'BAD_REQUEST' && response.tree.properties?.body) {
                setFieldErrors(response.tree.properties.body);
            } else {
                setGlobalError(response.code);
            }
        }
    };

    const properties = fieldErrors?.properties;

    if (user) return <Navigate to="/" replace />;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer select-none"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                                ${
                                    properties?.email?.errors?.length
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300'
                                }`}
                            required
                        />
                        {properties?.email?.errors?.[0] && (
                            <p className="mt-1 text-xs text-red-600">{properties.email.errors[0]}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer select-none"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                                ${
                                    properties?.password?.errors?.length
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300'
                                }`}
                            required
                        />
                        {properties?.password?.errors?.[0] && (
                            <p className="mt-1 text-xs text-red-600">{properties.password.errors[0]}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer select-none"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                                ${
                                    properties?.confirmPassword?.errors?.length
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300'
                                }`}
                            required
                        />
                        {properties?.confirmPassword?.errors?.[0] && (
                            <p className="mt-1 text-xs text-red-600">{properties.confirmPassword.errors[0]}</p>
                        )}
                    </div>

                    {globalError && (
                        <div className="p-3 rounded bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
                            {globalError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-semibold py-2 px-4 rounded transition duration-200 select-none
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
