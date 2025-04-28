import { useMemo } from 'react';

const Home = () => {
    const months = useMemo(() => {
        const currentDate = new Date();
        const list: { label: string; value: string }[] = [];

        for (let i = -4; i <= 4; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 01 -> 12
            const year = date.getFullYear();
            const label = `${month}/${year}`; // Affichage pour l'utilisateur
            const value = `${year}-${month}`; // Valeur interne style 2025-04

            list.push({ label, value });
        }

        return list;
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {months.map((month) => {
                    const currentDate = new Date();
                    const [currentYear, currentMonth] = [currentDate.getFullYear(), currentDate.getMonth() + 1];
                    const [year, monthNum] = month.value.split('-').map(Number);

                    const isCurrentMonth = currentYear === year && currentMonth === monthNum;
                    const isPast = year < currentYear || (year === currentYear && monthNum < currentMonth);

                    return (
                        <div
                            key={month.value}
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
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
