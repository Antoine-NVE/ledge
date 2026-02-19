import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { $ZodErrorTree } from 'zod/v4/core';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import type { LoginSchema } from '@shared/schemas/auth/login.schema';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<$ZodErrorTree<LoginSchema['body']> | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors(null);

        const response = await login({ email, password, rememberMe });

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
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

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

                    <div className="flex items-center">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label
                            htmlFor="rememberMe"
                            className="ml-2 block text-sm text-gray-900 cursor-pointer select-none"
                        >
                            Remember me
                        </label>
                    </div>

                    {globalError && (
                        <div className="p-3 rounded bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
                            {globalError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-semibold py-2 px-4 rounded transition duration-200
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
