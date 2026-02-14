import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

interface Form {
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
}

const Register = () => {
    const [form, setForm] = useState<Form>({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => {
            const updated = { ...prev };
            delete updated[name as keyof FormErrors];
            return updated;
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const [result, response] = await register(form.email, form.password, form.confirmPassword);

        if (!response || !response.ok) {
            setError(result.message);
            setFormErrors(result.fields || {});
            setIsLoading(false);
            return;
        }

        setSuccess(result.message);
        setIsLoading(false);
        navigate('/');
    };

    const inputBaseClass = 'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500';

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            id="email"
                            type="text"
                            value={form.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`${inputBaseClass} ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.email && formErrors.email[0] && (
                            <p className="mt-1 text-xs text-red-600">{formErrors.email[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`${inputBaseClass} ${
                                formErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formErrors.password && formErrors.password[0] && (
                            <p className="mt-1 text-xs text-red-600">{formErrors.password[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            id="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`${inputBaseClass} ${
                                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {formErrors.confirmPassword && formErrors.confirmPassword[0] && (
                            <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword[0]}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
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
