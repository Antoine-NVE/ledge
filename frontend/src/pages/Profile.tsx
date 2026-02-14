import { useState } from 'react';
import { sendVerificationEmail } from '../api/user';
import useUser from '../hooks/useUser';

const Profile = () => {
    const { user } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSendVerificationEmail = async () => {
        setMessage(null);
        setSuccess(null);

        setIsLoading(true);
        const [result, response] = await sendVerificationEmail();
        setIsLoading(false);

        setMessage(result.message);

        if (!response || !response.ok) {
            setSuccess(false);
            return;
        }

        setSuccess(true);
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-4">Profile page</h1>
            <p className="text-lg mb-6">This is the profile page.</p>
            {!user?.isEmailVerified && (
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                    onClick={handleSendVerificationEmail}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send verification email'}
                </button>
            )}
            {message && <div className={`mt-4 ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        </div>
    );
};

export default Profile;
