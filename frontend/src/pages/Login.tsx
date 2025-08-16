import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { login } from '../api/auth';

interface Form {
    email: string;
    password: string;
    rememberMe: boolean;
}

const Login = () => {
    const [form, setForm] = useState<Form>({ email: '', password: '', rememberMe: false });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const [result, response] = await login(form.email, form.password, form.rememberMe);

        if (!response || !response.ok) {
            setError(result.message);
        } else {
            setSuccess(result.message);
            setUser(result.data!.user);
            navigate('/');
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {user && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already logged in:{' '}
                        <Link to="/" className="text-blue-600 hover:underline">
                            Go to Dashboard
                        </Link>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rememberMe" className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={form.rememberMe}
                                onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                                className="mr-2 cursor-pointer"
                            />
                            Remember me
                        </label>
                    </div>

                    {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
                    {success && <div className="mb-4 text-green-600 text-sm text-center">{success}</div>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                        disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
