
import React from 'react';
import { MONTH_NAMES } from '../constants';
import { LockClosedIcon } from './icons/Icons';

interface HeaderProps {
    selectedDate: Date;
    onDateChange: (newDate: Date) => void;
    isMonthClosed: boolean;
    onCloseMonth: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedDate, onDateChange, isMonthClosed, onCloseMonth }) => {
    
    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month] = e.target.value.split('-').map(Number);
        // month is 1-based from input, but 0-based for Date constructor
        const newDate = new Date(year, month - 1, 2); // Use day 2 to be safe with timezones
        onDateChange(newDate);
    };

    const dateInputValue = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                Dashboard de Performance SDR
            </h1>
            <div className="flex items-center gap-4">
                 <input
                    type="month"
                    value={dateInputValue}
                    onChange={handleDateInputChange}
                    className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-lg font-semibold w-48 text-center"
                />
                <button
                    onClick={onCloseMonth}
                    disabled={isMonthClosed}
                    className={`flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-all ${
                        isMonthClosed
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    }`}
                >
                    <LockClosedIcon />
                    {isMonthClosed ? 'Mês Fechado' : 'Fechar Mês'}
                </button>
            </div>
        </header>
    );
};

export default Header;
