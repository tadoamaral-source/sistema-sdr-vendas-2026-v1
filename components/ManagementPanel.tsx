
import React, { useState } from 'react';
import { Gender } from '../types';
import { UserPlusIcon } from './icons/Icons';

interface ManagementPanelProps {
    onAddSalesperson: (name: string, gender: Gender) => void;
    isMonthClosed: boolean;
}

const ManagementPanel: React.FC<ManagementPanelProps> = ({ onAddSalesperson, isMonthClosed }) => {
    const [newSalespersonName, setNewSalespersonName] = useState('');
    const [newSalespersonGender, setNewSalespersonGender] = useState<Gender>(Gender.MALE);

    const handleAddSalesperson = () => {
        if(newSalespersonName.trim()){
            onAddSalesperson(newSalespersonName.trim(), newSalespersonGender);
            setNewSalespersonName('');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Painel Gerencial</h3>
            {!isMonthClosed ? (
                 <div className="flex flex-col sm:flex-row gap-2 items-center">
                     <input
                        type="text"
                        value={newSalespersonName}
                        onChange={(e) => setNewSalespersonName(e.target.value)}
                        placeholder="Nome do Consultor"
                        className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow"
                    />
                    <select
                        value={newSalespersonGender}
                        onChange={(e) => setNewSalespersonGender(e.target.value as Gender)}
                         className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto"
                    >
                        <option value={Gender.MALE}>Homem</option>
                        <option value={Gender.FEMALE}>Mulher</option>
                    </select>
                    <button onClick={handleAddSalesperson} className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 w-full sm:w-auto">
                        <UserPlusIcon />
                        <span>Adicionar</span>
                    </button>
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">O painel está bloqueado pois o mês foi fechado.</p>
            )}
        </div>
    );
};

export default ManagementPanel;
