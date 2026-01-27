
import React, { useMemo } from 'react';
import { MonthlyData } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthEndSummaryProps {
    monthlyData: MonthlyData;
}

const COLORS = ['#00C49F', '#FF8042'];

const MonthEndSummary: React.FC<MonthEndSummaryProps> = ({ monthlyData }) => {
    const summaryData = useMemo(() => {
        const totalSales = monthlyData.consultants.reduce((sum, c) => sum + c.nrSales + c.mrrSales, 0);
        const totalGoal = monthlyData.nrGoal + monthlyData.mrrGoal;
        const remainingGoal = totalGoal > totalSales ? totalGoal - totalSales : 0;
        const percentage = totalGoal > 0 ? (totalSales / totalGoal) * 100 : 0;

        const chartData = [
            { name: 'Resultado', value: totalSales },
            { name: 'Meta Restante', value: remainingGoal },
        ].filter(d => d.value > 0);

        return { totalSales, totalGoal, percentage, chartData };
    }, [monthlyData]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Fechamento do Mês: Meta vs. Resultado (Financeiro)</h2>
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={summaryData.chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {summaryData.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{summaryData.percentage.toFixed(2)}%</h3>
                    <p className="text-gray-500 dark:text-gray-400">da meta financeira atingida</p>
                    <div className="mt-4 space-y-2">
                        <p><strong>Meta Total:</strong> {summaryData.totalGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        <p><strong>Resultado Total:</strong> {summaryData.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthEndSummary;
