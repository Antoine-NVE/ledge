import { useMemo, useState } from 'react';

type Status = 'past' | 'current' | 'future';

type Year = {
    number: number;
    string: string; // Stringified version of number
    status: Status;
    months: Month[];
};

type Month = {
    number: number;
    string: string; // Stringified version of number (02 or 11 for example, not february or november)
    status: Status;
};

const useYear = () => {
    const [yearOffset, setYearOffset] = useState(0);

    const now = new Date();
    const currentRealYear = now.getFullYear();
    const currentRealMonth = now.getMonth() + 1;

    const year = useMemo<Year>(() => {
        const number = currentRealYear + yearOffset;
        const string = String(number);
        const status: Status = number === currentRealYear ? 'current' : number < currentRealYear ? 'past' : 'future';

        const months: Month[] = [];
        for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
            const monthString = String(monthNumber).padStart(2, '0');
            const monthStatus: Status =
                number === currentRealYear && monthNumber === currentRealMonth
                    ? 'current'
                    : number < currentRealYear || (number === currentRealYear && monthNumber < currentRealMonth)
                      ? 'past'
                      : 'future';

            months.push({ number: monthNumber, string: monthString, status: monthStatus });
        }

        return { number, string, status, months };
    }, [currentRealYear, currentRealMonth, yearOffset]);

    return {
        year,
        goToPreviousYear: () => setYearOffset((prev) => prev - 1),
        goToNextYear: () => setYearOffset((prev) => prev + 1),
        goToCurrentYear: () => setYearOffset(0),
    };
};

export default useYear;
