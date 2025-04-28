import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [offset, setOffset] = useState(0); // Décalage de 9 mois

    const months = useMemo(() => {
        const currentDate = new Date();
        const list: { label: string; value: string; date: Date }[] = [];

        for (let i = -4 + offset; i <= 4 + offset; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const label = `${month}/${year}`;
            const value = `${year}-${month}`;

            list.push({ label, value, date });
        }

        return list;
    }, [offset]);

    const currentDate = new Date();

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Ledge</h1>

            {/* Bouton aujourd'hui */}
            <div className="mb-4">
                <button
                    onClick={() => setOffset(0)}
                    className="bg-white hover:bg-gray-200 text-gray-800 rounded-md px-3 py-1 text-sm shadow cursor-pointer">
                    Aujourd'hui
                </button>
            </div>

            {/* Flèches de navigation + texte */}
            <div className="flex items-center gap-6 mb-6">
                <button
                    onClick={() => setOffset(offset - 9)}
                    className="text-2xl px-2 hover:text-gray-600 cursor-pointer">
                    ←
                </button>

                <div className="text-lg font-semibold text-center">
                    {months[0].label} - {months[months.length - 1].label}
                </div>

                <button
                    onClick={() => setOffset(offset + 9)}
                    className="text-2xl px-2 hover:text-gray-600 cursor-pointer">
                    →
                </button>
            </div>

            {/* Grille des mois */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {months.map((month) => {
                    const [currentYear, currentMonth] = [currentDate.getFullYear(), currentDate.getMonth() + 1];
                    const [year, monthNum] = month.value.split('-').map(Number);

                    const isCurrentMonth = currentYear === year && currentMonth === monthNum;
                    const isPast = year < currentYear || (year === currentYear && monthNum < currentMonth);

                    return (
                        <Link key={month.value} to={`/month/${month.value}`} className="w-full">
                            <div
                                className={`rounded-lg p-6 w-full h-24 flex items-center justify-center text-center cursor-pointer transition
                                    ${
                                        isCurrentMonth
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
}
