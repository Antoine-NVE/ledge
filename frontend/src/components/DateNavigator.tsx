interface Props {
    label: string;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    isCurrent: boolean;
}

const DateNavigator = ({ label, onPrev, onNext, onToday, isCurrent }: Props) => {
    return (
        <div className="flex items-center gap-6 mb-8">
            <button
                onClick={onPrev}
                className="text-2xl px-2 text-gray-600 hover:text-gray-900 cursor-pointer select-none transition"
                aria-label="Previous"
            >
                ←
            </button>

            <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-gray-800 select-none">{label}</span>

                <button
                    onClick={onToday}
                    disabled={isCurrent}
                    className={`text-xs mt-1 font-medium transition select-none
                        ${
                            isCurrent
                                ? 'text-gray-300 cursor-default'
                                : 'text-blue-600 hover:text-blue-800 cursor-pointer hover:underline'
                        }`}
                >
                    Today
                </button>
            </div>

            <button
                onClick={onNext}
                className="text-2xl px-2 text-gray-600 hover:text-gray-900 cursor-pointer select-none transition"
                aria-label="Next"
            >
                →
            </button>
        </div>
    );
};

export default DateNavigator;
