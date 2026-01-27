
import React, { useMemo } from 'react';
import { MonthlyData, Salesperson } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ChartsDashboardProps {
    salespersonList: Salesperson[];
    monthlyData: MonthlyData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
                <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ salespersonList, monthlyData }) => {
    const chartData = useMemo(() => {
        const leadDistribution = salespersonList.map(sp => {
            const data = monthlyData.consultants.find(c => c.salespersonId === sp.id);
            const totalLeads = (data?.inboundLeads || 0) + (data?.outboundLeads || 0) + (data?.partnerLeads || 0);
            return { name: sp.name, value: totalLeads };
        }).filter(d => d.value > 0);

        const totalInbound = monthlyData.consultants.reduce((sum, c) => sum + c.inboundLeads, 0);
        const totalOutbound = monthlyData.consultants.reduce((sum, c) => sum + c.outboundLeads, 0);
        const totalPartner = monthlyData.consultants.reduce((sum, c) => sum + c.partnerLeads, 0);

        const leadSource = [
            { name: 'Inbound', value: totalInbound },
            { name: 'Outbound', value: totalOutbound },
            { name: 'Parceiros', value: totalPartner },
        ].filter(item => item.value > 0);

        const closingRate = salespersonList.map(sp => {
            const data = monthlyData.consultants.find(c => c.salespersonId === sp.id);
            const totalLeads = data ? data.inboundLeads + data.outboundLeads + data.partnerLeads : 0;
            const contracts = data?.contractsSigned || 0;
            const rate = totalLeads > 0 ? (contracts / totalLeads) * 100 : 0;
            return { name: sp.name, 'Taxa de Fechamento (%)': parseFloat(rate.toFixed(2)) };
        });

        return { leadDistribution, leadSource, closingRate };
    }, [salespersonList, monthlyData]);

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Distribuição de Leads por Vendedor</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={chartData.leadDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {chartData.leadDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Origem dos Leads</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={chartData.leadSource} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#82ca9d" label>
                             {chartData.leadSource.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Taxa de Fechamento por Vendedor</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.closingRate} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Taxa de Fechamento (%)" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartsDashboard;
