import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { requestEmailVerification } from '../api/users.ts';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';

const Profile = () => {
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="flex flex-col flex-1 items-center justify-center p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    const handleRequestEmailVerification = async () => {
        setSuccess(null);
        setMessage(null);

        setIsSending(true);
        const response = await requestEmailVerification({ frontendBaseUrl: window.location.origin });
        setIsSending(false);

        if (!response.success) {
            setSuccess(false);
            setMessage(response.code);
            return;
        }

        setSuccess(true);
        setMessage('Email sent successfully!');
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col flex-1 items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Profile page</h1>
                <p className="text-lg mb-6">This is the profile page.</p>
                {!user.isEmailVerified && (
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                        onClick={handleRequestEmailVerification}
                        disabled={isSending}
                    >
                        {isSending ? 'Sending...' : 'Request email verification'}
                    </button>
                )}
                {message && <div className={`mt-4 ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
            </div>
        </>
    );
};

export default Profile;
