import { useState } from 'react';
import { sendVerificationEmail } from '../api/user';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSendVerificationEmail = async () => {
        setLoading(true);
        setError(null);
        const [result, response] = await sendVerificationEmail();
        setLoading(false);
        if (!response || !response.ok) {
            setError(result.message);
            return;
        }
        setSuccess(result.message);
        setError(null);
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-4">Profile page</h1>
            <p className="text-lg mb-6">This is the profile page.</p>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                onClick={handleSendVerificationEmail}
                disabled={loading}>
                {loading ? 'Sending...' : 'Send verification email'}
            </button>
            {success && <div className="mt-4 text-green-600">{success}</div>}
            {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
    );
};

export default Profile;
