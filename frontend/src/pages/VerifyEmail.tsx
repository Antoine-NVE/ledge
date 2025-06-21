import { useState } from 'react';
import { verifyEmail } from '../api/user';
import { useParams } from 'react-router-dom';

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleClick = async () => {
        setSuccess(null);
        setMessage(null);

        // Should not happen, but just in case
        if (!token) {
            setSuccess(false);
            setMessage('Invalid or missing verification token.');
            return;
        }

        setIsLoading(true);
        const [result, response] = await verifyEmail(token);
        setIsLoading(false);

        setMessage(result.message);

        if (!response || !response.ok) {
            setSuccess(false);
            return;
        }

        setSuccess(true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
                {success === null && (
                    <>
                        <p className="mb-4">Click the button below to verify your email address.</p>
                        <button
                            onClick={handleClick}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
                            disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </>
                )}
                {success === true && (
                    <div className="text-green-600">
                        <p className="mb-2">{message}</p>
                        <p>You can now leave this page.</p>
                    </div>
                )}
                {success === false && (
                    <div className="text-red-600">
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
