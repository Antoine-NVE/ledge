import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useState } from 'react';

interface FormErrors {
    email?: string;
    password?: string;
}

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleRegister = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const [result, response] = await register(email, password);
        if (!response || !response.ok) {
            setError(result.message);
            if (result.errors) {
                setFormErrors(result.errors);
            } else {
                setFormErrors({});
            }
            setLoading(false);
            return;
        }
        setSuccess(result.message);
        navigate('/');
        setLoading(false);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleRegister(email, password);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            className={`w-full px-3 py-2 border ${
                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`w-full px-3 py-2 border ${
                                formErrors.password ? 'border-red-500' : 'border-gray-300'
                            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                        disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
