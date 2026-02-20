import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DateNavigator from '../components/DateNavigator';
import useYear from '../hooks/useYear';
import { useAuth } from '../hooks/useAuth.ts';

const monthCardClassByStatus = {
    current: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300',
    past: 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600',
    future: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900',
} as const;

const Home = () => {
    const { user, isLoading } = useAuth();
    const { year, goToPreviousYear, goToNextYear, goToCurrentYear } = useYear();

    if (isLoading) return <div className="flex flex-col flex-1 items-center justify-center p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <>
            <Navbar />
            <div className="flex flex-col flex-1 items-center justify-center p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 select-none">Ledge</h1>

                <DateNavigator
                    label={year.string}
                    onPrev={goToPreviousYear}
                    onNext={goToNextYear}
                    onToday={goToCurrentYear}
                    isCurrent={year.status === 'current'}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    {year.months.map((month) => {
                        const monthValue = `${year.string}-${month.string}`;
                        const monthLabel = `${month.string}/${year.string}`;

                        return (
                            <Link
                                key={monthValue}
                                to={`/month/${monthValue}`}
                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                            >
                                <div
                                    className={`rounded-lg p-6 w-full h-24 flex items-center justify-center text-center font-medium transition shadow-sm select-none border ${monthCardClassByStatus[month.status]}`}
                                >
                                    {monthLabel}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Home;
