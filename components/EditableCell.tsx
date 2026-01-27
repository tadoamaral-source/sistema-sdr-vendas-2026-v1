

import React, { useState, KeyboardEvent } from 'react';

interface EditableCellProps {
    value: number;
    onSave: (value: number) => void;
    isLocked?: boolean;
    formatAs?: 'currency' | 'percent' | 'number';
}

const formatValue = (value: number, format?: 'currency' | 'percent' | 'number') => {
    if (isNaN(value)) value = 0;
    switch (format) {
        case 'currency':
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        case 'percent':
            return `${(value * 100).toFixed(2)}%`;
        case 'number':
        default:
            return value.toString();
    }
};

// Fix: Removed default prop value from destructuring to resolve a type inference issue.
const EditableCell: React.FC<EditableCellProps> = ({ value, onSave, isLocked = false, formatAs }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value.toString());

    const handleSave = () => {
        const numericValue = parseFloat(currentValue) || 0;
        onSave(numericValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setCurrentValue(value.toString());
            setIsEditing(false);
        }
    };
    
    if (isLocked) {
        return <span className="px-2 py-1">{formatValue(value, formatAs)}</span>;
    }

    if (isEditing) {
        return (
            <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-indigo-100 dark:bg-gray-600 text-center rounded border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        );
    }

    return (
        <span onClick={() => setIsEditing(true)} className="cursor-pointer px-2 py-1 hover:bg-indigo-100 dark:hover:bg-gray-600 rounded">
            {formatValue(value, formatAs)}
        </span>
    );
};

export default EditableCell;
