import { useState } from 'react';
import { verifyEmail } from '../api/users.ts';
import { useParams } from 'react-router-dom';

export default function VerifyEmail() {
    const { emailVerificationToken } = useParams<{ emailVerificationToken: string }>();

    const [isVerifying, setIsVerifying] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    if (!emailVerificationToken) {
        return <div className="text-center p-10 text-red-600">Lien invalide (token manquant).</div>;
    }

    const handleVerify = async () => {
        setSuccess(null);
        setMessage(null);

        setIsVerifying(true);
        const response = await verifyEmail({ emailVerificationToken });
        setIsVerifying(false);

        if (!response.success) {
            setSuccess(false);
            setMessage(response.code);
            return;
        }

        setSuccess(true);
        setMessage('Email verified successfully!');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Verify your email</h1>
                {success === null && (
                    <>
                        <p className="mb-4">Click the button below to verify your email address.</p>
                        <button
                            onClick={handleVerify}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer"
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Email'}
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
