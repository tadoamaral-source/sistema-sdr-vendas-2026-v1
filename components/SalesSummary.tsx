
import React, { useMemo } from 'react';
import { MonthlyData } from '../types';
import EditableCell from './EditableCell';

interface SalesSummaryProps {
    monthlyData: MonthlyData;
    onUpdate: (field: keyof Omit<MonthlyData, 'consultants' | 'year' | 'month' | 'isClosed'>, value: number) => void;
}

const ResultDisplay: React.FC<{value: number}> = ({ value }) => {
    const color = value < 0 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100';
    return <span className={color}>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ monthlyData, onUpdate }) => {
    const totals = useMemo(() => {
        const totalNRSales = monthlyData.consultants.reduce((sum, c) => sum + c.nrSales, 0);
        const totalMRRSales = monthlyData.consultants.reduce((sum, c) => sum + c.mrrSales, 0);
        
        return { totalNRSales, totalMRRSales };
    }, [monthlyData.consultants]);

    const differenceNR = totals.totalNRSales - monthlyData.nrGoal;
    const differenceMRR = totals.totalMRRSales - monthlyData.mrrGoal;
    const differenceManagerial = (totals.totalNRSales + totals.totalMRRSales) - monthlyData.managerialGoal;


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="bg-slate-800 text-white p-4">
                     <h2 className="text-xl font-bold">Vendas</h2>
                </div>
                <div className="p-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-2 text-left font-semibold"></th>
                                <th className="p-2 text-right font-semibold">META</th>
                                <th className="p-2 text-right font-semibold">RESULTADO</th>
                                <th className="p-2 text-right font-semibold">DIFERENÇA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-2 font-semibold">N.R</td>
                                <td className="p-2 text-right"><EditableCell value={monthlyData.nrGoal} onSave={(v) => onUpdate('nrGoal', v)} isLocked={monthlyData.isClosed} formatAs="currency" /></td>
                                <td className="p-2 text-right font-semibold"><ResultDisplay value={totals.totalNRSales}/></td>
                                <td className="p-2 text-right font-semibold"><ResultDisplay value={differenceNR}/></td>
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-2 font-semibold">MRR</td>
                                <td className="p-2 text-right"><EditableCell value={monthlyData.mrrGoal} onSave={(v) => onUpdate('mrrGoal', v)} isLocked={monthlyData.isClosed} formatAs="currency" /></td>
                                <td className="p-2 text-right font-semibold"><ResultDisplay value={totals.totalMRRSales}/></td>
                                <td className="p-2 text-right font-semibold"><ResultDisplay value={differenceMRR}/></td>
                            </tr>
                            <tr>
                                <td className="p-2 font-semibold">GERENCIAL</td>
                                <td className="p-2 text-right"><EditableCell value={monthlyData.managerialGoal} onSave={(v) => onUpdate('managerialGoal', v)} isLocked={monthlyData.isClosed} formatAs="currency" /></td>
                                <td className="p-2 text-right font-semibold"> - </td>
                                <td className="p-2 text-right font-semibold"><ResultDisplay value={differenceManagerial}/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                 <div className="bg-slate-800 text-white p-4">
                    <h2 className="text-xl font-bold">Quantidade de SDR Ativo</h2>
                 </div>
                 <div className="p-4">
                     <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-2 w-1/2">EM PRODUÇÃO</td>
                                <td className="p-2 text-right"><EditableCell value={monthlyData.sdrInProduction} onSave={(v) => onUpdate('sdrInProduction', v)} isLocked={monthlyData.isClosed} /></td>
                            </tr>
                            <tr>
                                <td className="p-2 w-1/2">EM PREPARAÇÃO</td>
                                <td className="p-2 text-right"><EditableCell value={monthlyData.sdrInPreparation} onSave={(v) => onUpdate('sdrInPreparation', v)} isLocked={monthlyData.isClosed} /></td>
                            </tr>
                        </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
};

export default SalesSummary;
