import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import DateNavigator from '../components/DateNavigator';

const Home = () => {
    const { user, isLoading } = useAuth();
    const [yearOffset, setYearOffset] = useState(0);

    const now = new Date();
    const currentRealYear = now.getFullYear();
    const currentRealMonth = now.getMonth() + 1;

    const displayYear = currentRealYear + yearOffset;

    const months = useMemo(() => {
        const list: { label: string; value: string; isCurrent: boolean; isPast: boolean }[] = [];
        for (let m = 1; m <= 12; m++) {
            const monthStr = m.toString().padStart(2, '0');
            const label = `${monthStr}/${displayYear}`;
            const value = `${displayYear}-${monthStr}`;
            const isCurrent = displayYear === currentRealYear && m === currentRealMonth;
            const isPast = displayYear < currentRealYear || (displayYear === currentRealYear && m < currentRealMonth);
            list.push({ label, value, isCurrent, isPast });
        }
        return list;
    }, [displayYear, currentRealYear, currentRealMonth]);

    if (isLoading) return <div className="flex flex-col flex-1 items-center justify-center p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <>
            <Navbar />
            <div className="flex flex-col flex-1 items-center justify-center p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 select-none">Ledge</h1>

                <DateNavigator
                    label={String(displayYear)}
                    onPrev={() => setYearOffset((prev) => prev - 1)}
                    onNext={() => setYearOffset((prev) => prev + 1)}
                    onToday={() => setYearOffset(0)}
                    isCurrent={yearOffset === 0}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    {months.map((month) => (
                        <Link
                            key={month.value}
                            to={`/month/${month.value}`}
                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                        >
                            <div
                                className={`rounded-lg p-6 w-full h-24 flex items-center justify-center text-center font-medium transition shadow-sm select-none border
                                ${
                                    month.isCurrent
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
                                        : month.isPast
                                          ? 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'
                                }`}
                            >
                                {month.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
