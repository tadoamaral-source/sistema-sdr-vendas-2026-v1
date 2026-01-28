
import React, { useState, useMemo, useCallback } from 'react';
import { AllData, MonthlyData, Salesperson, Gender, ConsultantData } from './types';
import { MALE_AVATARS, FEMALE_AVATARS, MONTH_NAMES } from './constants';
import Header from './components/Header';
import SalesSummary from './components/SalesSummary';
import ConsultantPerformanceTable from './components/ConsultantPerformanceTable';
import ChartsDashboard from './components/ChartsDashboard';
import MonthEndSummary from './components/MonthEndSummary';
import ManagementPanel from './components/ManagementPanel';
import useStickyState from './hooks/useStickyState';

const createDefaultState = () => {
    // Cria um estado padrão se o localStorage estiver vazio
    const initialSalespersons = [
        { id: 'sp1', name: 'FRANCISCO', gender: Gender.MALE, avatar: MALE_AVATARS[0] },
        { id: 'sp2', name: 'JOSÉ ROBERTO', gender: Gender.MALE, avatar: MALE_AVATARS[1] },
        { id: 'sp3', name: 'PEDRO', gender: Gender.MALE, avatar: MALE_AVATARS[2] },
    ];
    
    const selectedDate = new Date();
    const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()).padStart(2, '0')}`;
    const initialConsultantData = initialSalespersons.map(sp => ({
        salespersonId: sp.id, sdrGoal: 10, leadGoal: 15,
        inboundLeads: Math.floor(Math.random() * 10), outboundLeads: Math.floor(Math.random() * 5),
        partnerLeads: Math.floor(Math.random() * 3), iaLeads: Math.floor(Math.random() * 4),
        magoGoal: 3, magoAchieved: Math.floor(Math.random() * 4),
        financialGoalNR: 22200, nrSales: Math.random() * 15000,
        financialGoalMRR: 2800, mrrSales: Math.random() * 2000, contractsSigned: Math.floor(Math.random() * 5) + 1,
    }));

    const initialAllData = {
        [key]: {
            year: selectedDate.getFullYear(), month: selectedDate.getMonth(), workingDays: 21,
            sdrInProduction: 2, sdrInPreparation: 2, nrGoal: 216800, mrrGoal: 18800, managerialGoal: 195120,
            consultants: initialConsultantData, isClosed: false
        }
    };

    return { salespersonList: initialSalespersons, allData: initialAllData };
};


const App: React.FC = () => {
    const defaultState = useMemo(() => createDefaultState(), []);
    
    const [salespersonList, setSalespersonList] = useStickyState<Salesperson[]>(defaultState.salespersonList, 'sdr-dashboard-salespersons');
    const [allData, setAllData] = useStickyState<AllData>(defaultState.allData, 'sdr-dashboard-allData');
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const currentMonthKey = useMemo(() => `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()).padStart(2, '0')}`, [selectedDate]);

    const currentMonthData = useMemo(() => {
        if (allData[currentMonthKey]) {
            return allData[currentMonthKey];
        }
        // Retorna um objeto vazio temporário para evitar crashes se os dados do mês ainda não foram criados.
        // A lógica em `handleDateChange` irá criar os dados corretamente.
        const newMonthData: MonthlyData = {
            year: selectedDate.getFullYear(), month: selectedDate.getMonth(), workingDays: 21,
            sdrInProduction: 2, sdrInPreparation: 2, nrGoal: 216800, mrrGoal: 18800, managerialGoal: 195120,
            consultants: salespersonList.map(sp => ({
                salespersonId: sp.id, sdrGoal: 0, leadGoal: 0, inboundLeads: 0, outboundLeads: 0, partnerLeads: 0, iaLeads: 0,
                magoGoal: 0, magoAchieved: 0, financialGoalNR: 0, nrSales: 0, financialGoalMRR: 0, mrrSales: 0, contractsSigned: 0,
            })), isClosed: false,
        };
        return newMonthData;
    }, [allData, currentMonthKey, selectedDate, salespersonList]);

    const handleDateChange = (newDate: Date) => {
        const newKey = `${newDate.getFullYear()}-${String(newDate.getMonth()).padStart(2, '0')}`;
        if (!allData[newKey]) {
            setAllData(prevData => ({ ...prevData, [newKey]: {
                    year: newDate.getFullYear(), month: newDate.getMonth(), workingDays: 21,
                    sdrInProduction: 2, sdrInPreparation: 2, nrGoal: 216800, mrrGoal: 18800, managerialGoal: 195120,
                    consultants: salespersonList.map(sp => ({
                        salespersonId: sp.id, sdrGoal: 0, leadGoal: 0, inboundLeads: 0, outboundLeads: 0, partnerLeads: 0, iaLeads: 0,
                        magoGoal: 0, magoAchieved: 0, financialGoalNR: 0, nrSales: 0, financialGoalMRR: 0, mrrSales: 0, contractsSigned: 0,
                    })), isClosed: false,
                }
            }));
        }
        setSelectedDate(newDate);
    };

    const updateMonthData = useCallback((field: keyof Omit<MonthlyData, 'consultants' | 'year' | 'month'| 'isClosed'>, value: number) => {
        if (currentMonthData.isClosed) return;
        setAllData(prev => ({...prev, [currentMonthKey]: { ...prev[currentMonthKey], [field]: value }}));
    }, [currentMonthKey, currentMonthData.isClosed, setAllData]);

    const updateConsultantData = useCallback((salespersonId: string, field: keyof Omit<ConsultantData, 'salespersonId'>, value: number) => {
        if (currentMonthData.isClosed) return;
        setAllData(prev => {
            const updatedConsultants = (prev[currentMonthKey]?.consultants || []).map(c =>
                c.salespersonId === salespersonId ? { ...c, [field]: value } : c
            );
            return {...prev, [currentMonthKey]: { ...prev[currentMonthKey], consultants: updatedConsultants }};
        });
    }, [currentMonthKey, currentMonthData.isClosed, setAllData]);

    const addSalesperson = (name: string, gender: Gender) => {
        const newSalesperson: Salesperson = {
            id: `sp${Date.now()}`, name, gender,
            avatar: gender === Gender.MALE
                ? MALE_AVATARS[salespersonList.filter(sp => sp.gender === Gender.MALE).length % MALE_AVATARS.length]
                : FEMALE_AVATARS[salespersonList.filter(sp => sp.gender === Gender.FEMALE).length % FEMALE_AVATARS.length],
        };
        setSalespersonList(prev => [...prev, newSalesperson]);
        setAllData(prevAllData => {
            const newAllData = { ...prevAllData };
            for (const key in newAllData) {
                if (newAllData[key].consultants.every(c => c.salespersonId !== newSalesperson.id)) {
                    newAllData[key].consultants.push({
                        salespersonId: newSalesperson.id, sdrGoal: 0, leadGoal: 0, inboundLeads: 0, outboundLeads: 0, partnerLeads: 0, iaLeads: 0,
                        magoGoal: 0, magoAchieved: 0, financialGoalNR: 0, nrSales: 0, financialGoalMRR: 0, mrrSales: 0, contractsSigned: 0,
                    });
                }
            }
            return newAllData;
        });
    };
    
    const updateSalespersonName = (id: string, name: string) => {
        if (currentMonthData.isClosed) return;
        setSalespersonList(prev => prev.map(sp => sp.id === id ? { ...sp, name } : sp));
    };

    const removeSalesperson = (id: string) => {
        if (window.confirm("Tem certeza que deseja remover este consultor? Esta ação removerá seus dados de todos os meses.")) {
            setSalespersonList(prev => prev.filter(sp => sp.id !== id));
            setAllData(prevAllData => {
                const newAllData = { ...prevAllData };
                for (const key in newAllData) {
                    newAllData[key].consultants = newAllData[key].consultants.filter(c => c.salespersonId !== id);
                }
                return newAllData;
            });
        }
    };

    const closeMonth = () => {
        if (window.confirm(`Tem certeza que deseja fechar o mês de ${MONTH_NAMES[selectedDate.getMonth()]}? Esta ação não pode ser desfeita.`)) {
            setAllData(prev => ({...prev, [currentMonthKey]: { ...prev[currentMonthKey], isClosed: true }}));
        }
    };

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <Header 
                    selectedDate={selectedDate} 
                    onDateChange={handleDateChange} 
                    isMonthClosed={currentMonthData.isClosed}
                    onCloseMonth={closeMonth}
                />
                <main className="mt-6 grid gap-6">
                    <SalesSummary
                        monthlyData={currentMonthData}
                        onUpdate={updateMonthData}
                    />
                    <ManagementPanel 
                        onAddSalesperson={addSalesperson}
                        isMonthClosed={currentMonthData.isClosed}
                    />
                    <ConsultantPerformanceTable
                        salespersonList={salespersonList}
                        monthlyData={currentMonthData}
                        onUpdateConsultant={updateConsultantData}
                        onRemoveSalesperson={removeSalesperson}
                        onUpdateSalespersonName={updateSalespersonName}
                    />
                    <ChartsDashboard salespersonList={salespersonList} monthlyData={currentMonthData} />
                    <MonthEndSummary monthlyData={currentMonthData} />
                </main>
            </div>
        </div>
    );
};

export default App;