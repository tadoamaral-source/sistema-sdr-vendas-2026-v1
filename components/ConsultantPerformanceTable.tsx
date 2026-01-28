
import React, { useMemo } from 'react';
import { Salesperson, MonthlyData, ConsultantData } from '../types';
import EditableCell from './EditableCell';
import EditableTextCell from './EditableTextCell';
import ProgressBar from './ProgressBar';
import ResultCell from './ResultCell';
import { TrashIcon } from './icons/Icons';

interface ConsultantPerformanceTableProps {
    salespersonList: Salesperson[];
    monthlyData: MonthlyData;
    onUpdateConsultant: (salespersonId: string, field: keyof Omit<ConsultantData, 'salespersonId'>, value: number) => void;
    onRemoveSalesperson: (id: string) => void;
    onUpdateSalespersonName: (id: string, name: string) => void;
}

const ConsultantPerformanceTable: React.FC<ConsultantPerformanceTableProps> = ({
    salespersonList,
    monthlyData,
    onUpdateConsultant,
    onRemoveSalesperson,
    onUpdateSalespersonName,
}) => {
    const data = useMemo(() => {
        return salespersonList.map(sp => {
            const consultantData = monthlyData.consultants.find(c => c.salespersonId === sp.id);
            if (!consultantData) return null;

            const receivedLeads = consultantData.inboundLeads + consultantData.outboundLeads + consultantData.partnerLeads + consultantData.iaLeads;
            const leadGoalAchieved = consultantData.leadGoal > 0 ? receivedLeads / consultantData.leadGoal : 0;
            const scheduledPerDay = monthlyData.workingDays > 0 ? receivedLeads / monthlyData.workingDays : 0;
            const resultNR = consultantData.nrSales - consultantData.financialGoalNR;
            const resultMRR = consultantData.mrrSales - consultantData.financialGoalMRR;
            
            return {
                ...sp,
                ...consultantData,
                receivedLeads,
                leadGoalAchieved,
                scheduledPerDay,
                resultNR,
                resultMRR,
            };
        }).filter((d): d is NonNullable<typeof d> => d !== null);
    }, [salespersonList, monthlyData]);

    const totals = useMemo(() => {
        const result = {
            sdrGoal: data.reduce((sum, d) => sum + d.sdrGoal, 0),
            leadGoal: data.reduce((sum, d) => sum + d.leadGoal, 0),
            receivedLeads: data.reduce((sum, d) => sum + d.receivedLeads, 0),
            inboundLeads: data.reduce((sum, d) => sum + d.inboundLeads, 0),
            outboundLeads: data.reduce((sum, d) => sum + d.outboundLeads, 0),
            partnerLeads: data.reduce((sum, d) => sum + d.partnerLeads, 0),
            iaLeads: data.reduce((sum, d) => sum + d.iaLeads, 0),
            magoGoal: data.reduce((sum, d) => sum + d.magoGoal, 0),
            magoAchieved: data.reduce((sum, d) => sum + d.magoAchieved, 0),
            contractsSigned: data.reduce((sum, d) => sum + d.contractsSigned, 0),
            financialGoalNR: data.reduce((sum, d) => sum + d.financialGoalNR, 0),
            nrSales: data.reduce((sum, d) => sum + d.nrSales, 0),
            resultNR: data.reduce((sum, d) => sum + d.resultNR, 0),
            financialGoalMRR: data.reduce((sum, d) => sum + d.financialGoalMRR, 0),
            mrrSales: data.reduce((sum, d) => sum + d.mrrSales, 0),
            resultMRR: data.reduce((sum, d) => sum + d.resultMRR, 0),
        };
        const totalLeadGoalAchieved = result.leadGoal > 0 ? result.receivedLeads / result.leadGoal : 0;
        const totalScheduledPerDay = monthlyData.workingDays > 0 ? result.receivedLeads / monthlyData.workingDays : 0;

        return {...result, totalLeadGoalAchieved, totalScheduledPerDay};
    }, [data, monthlyData.workingDays]);


    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">
                <thead className="text-xs text-white uppercase">
                    <tr className="bg-slate-800 dark:bg-slate-900">
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600">Consultor</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Metas SDR</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Meta Leads</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">% Qtd Lead Atingido</th>
                        <th colSpan={4} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Fontes</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Leads Agendados por Dia</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Meta Mago</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Realizado Mago</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Contratos</th>
                        <th colSpan={3} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Não Recorrente</th>
                        <th colSpan={3} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">MRR</th>
                        <th rowSpan={2} className="px-2 py-3 border border-gray-300 dark:border-gray-600 text-center">Ações</th>
                    </tr>
                    <tr className="bg-slate-700 dark:bg-slate-800">
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Inbound</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Outbound</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Lead Parceiro</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">IA Leads</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Meta Financeira N.R</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Vendido N.R</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Resultado Financeiro</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Meta Financeira MRR</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Vendido MRR</th>
                        <th className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">Resultado Financeiro MRR</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 font-medium"><EditableTextCell value={row.name} onSave={(name) => onUpdateSalespersonName(row.id, name)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.sdrGoal} onSave={(v) => onUpdateConsultant(row.id, 'sdrGoal', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.leadGoal} onSave={(v) => onUpdateConsultant(row.id, 'leadGoal', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 min-w-40"><ProgressBar value={row.leadGoalAchieved} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.inboundLeads} onSave={(v) => onUpdateConsultant(row.id, 'inboundLeads', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.outboundLeads} onSave={(v) => onUpdateConsultant(row.id, 'outboundLeads', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.partnerLeads} onSave={(v) => onUpdateConsultant(row.id, 'partnerLeads', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.iaLeads} onSave={(v) => onUpdateConsultant(row.id, 'iaLeads', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center font-semibold">{row.scheduledPerDay.toFixed(2)}</td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.magoGoal} onSave={(v) => onUpdateConsultant(row.id, 'magoGoal', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.magoAchieved} onSave={(v) => onUpdateConsultant(row.id, 'magoAchieved', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.contractsSigned} onSave={(v) => onUpdateConsultant(row.id, 'contractsSigned', v)} isLocked={monthlyData.isClosed} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.financialGoalNR} onSave={(v) => onUpdateConsultant(row.id, 'financialGoalNR', v)} isLocked={monthlyData.isClosed} formatAs="currency"/></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.nrSales} onSave={(v) => onUpdateConsultant(row.id, 'nrSales', v)} isLocked={monthlyData.isClosed} formatAs="currency"/></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><ResultCell value={row.resultNR} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.financialGoalMRR} onSave={(v) => onUpdateConsultant(row.id, 'financialGoalMRR', v)} isLocked={monthlyData.isClosed} formatAs="currency"/></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><EditableCell value={row.mrrSales} onSave={(v) => onUpdateConsultant(row.id, 'mrrSales', v)} isLocked={monthlyData.isClosed} formatAs="currency"/></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><ResultCell value={row.resultMRR} /></td>
                            <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">
                                {!monthlyData.isClosed && (
                                     <button onClick={() => onRemoveSalesperson(row.id)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon />
                                     </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="font-bold bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                     <tr className="border-t-2 border-gray-400 dark:border-gray-500">
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600">TOTAIS</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.sdrGoal}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.leadGoal}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600"><ProgressBar value={totals.totalLeadGoalAchieved} /></td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.inboundLeads}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.outboundLeads}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.partnerLeads}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.iaLeads}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.totalScheduledPerDay.toFixed(2)}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.magoGoal}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.magoAchieved}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.contractsSigned}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.financialGoalNR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.nrSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><ResultCell value={totals.resultNR} /></td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.financialGoalMRR.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center">{totals.mrrSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-center"><ResultCell value={totals.resultMRR} /></td>
                        <td className="px-2 py-2 border border-gray-300 dark:border-gray-600"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ConsultantPerformanceTable;