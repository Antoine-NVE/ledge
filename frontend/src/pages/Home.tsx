import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [yearOffset, setYearOffset] = useState(0); // Décalage en années

    const currentDate = new Date();
    const baseYear = currentDate.getFullYear() + yearOffset;
    const currentMonth = currentDate.getMonth() + 1; // 1 à 12

    const months = useMemo(() => {
        const list: { label: string; value: string; isCurrent: boolean }[] = [];

        for (let m = 1; m <= 12; m++) {
            const monthStr = m.toString().padStart(2, '0');
            const label = `${monthStr}/${baseYear}`;
            const value = `${baseYear}-${monthStr}`;

            const isCurrent = baseYear === currentDate.getFullYear() && m === currentMonth;

            list.push({ label, value, isCurrent });
        }

        return list;
    }, [baseYear, currentDate, currentMonth]);

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Ledge</h1>

            {/* Bouton aujourd'hui */}
            <div className="mb-4">
                <button
                    onClick={() => setYearOffset(0)}
                    disabled={yearOffset === 0}
                    className={`rounded-md px-3 py-1 text-sm shadow cursor-pointer transition ${
                        yearOffset === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-200 text-gray-800'
                    }`}>
                    Today
                </button>
            </div>

            {/* Flèches de navigation + texte */}
            <div className="flex items-center gap-6 mb-6">
                <button
                    onClick={() => setYearOffset((prev) => prev - 1)}
                    className="text-2xl px-2 hover:text-gray-600 cursor-pointer">
                    ←
                </button>

                <div className="text-lg font-semibold text-center">{baseYear}</div>

                <button
                    onClick={() => setYearOffset((prev) => prev + 1)}
                    className="text-2xl px-2 hover:text-gray-600 cursor-pointer">
                    →
                </button>
            </div>

            {/* Grille des mois */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {months.map((month, index) => {
                    const monthNumber = index + 1;
                    const isPast =
                        baseYear < currentDate.getFullYear() ||
                        (baseYear === currentDate.getFullYear() && monthNumber < currentMonth);

                    return (
                        <Link key={month.value} to={`/month/${month.value}`} className="w-full">
                            <div
                                className={`rounded-lg p-6 w-full h-24 flex items-center justify-center text-center cursor-pointer transition
                                    ${
                                        month.isCurrent
                                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                            : isPast
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-white text-gray-900 hover:bg-gray-200'
                                    }`}>
                                {month.label}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
