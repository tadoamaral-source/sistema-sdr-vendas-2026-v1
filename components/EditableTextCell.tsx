
import React, { useState, KeyboardEvent } from 'react';

interface EditableTextCellProps {
    value: string;
    onSave: (value: string) => void;
    isLocked?: boolean;
}

const EditableTextCell: React.FC<EditableTextCellProps> = ({ value, onSave, isLocked = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        if (currentValue.trim() === '') {
            setCurrentValue(value); // Reset if empty
        } else {
            onSave(currentValue.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setCurrentValue(value);
            setIsEditing(false);
        }
    };
    
    if (isLocked) {
        return <span className="px-2 py-1">{value}</span>;
    }

    if (isEditing) {
        return (
            <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-indigo-100 dark:bg-gray-600 rounded border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        );
    }

    return (
        <span onClick={() => setIsEditing(true)} className="cursor-pointer px-2 py-1 hover:bg-indigo-100 dark:hover:bg-gray-600 rounded">
            {value}
        </span>
    );
};

export default EditableTextCell;
