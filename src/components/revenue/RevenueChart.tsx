import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { MonthlyData } from '../../types';

interface RevenueChartProps {
  data: MonthlyData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(d => ({
    ...d,
    name: `${parseInt(d.month.split('-')[1])}月`,
  }));

  const hasData = data.some(d => d.revenue > 0 || d.expense > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-soft">
        <h3 className="text-sm font-semibold text-text-primary mb-3">月別推移</h3>
        <div className="h-40 flex items-center justify-center text-text-muted text-sm">
          データがまだありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft">
      <h3 className="text-sm font-semibold text-text-primary mb-3">月別推移</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#A0A0A0' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#A0A0A0' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => v >= 10000 ? `${v / 10000}万` : `${v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                `¥${value.toLocaleString()}`,
                name === 'revenue' ? '売上' : '経費',
              ]}
            />
            <Bar dataKey="revenue" fill="#4A7C59" radius={[4, 4, 0, 0]} barSize={12} name="revenue" />
            <Bar dataKey="expense" fill="#C2703E" radius={[4, 4, 0, 0]} barSize={12} name="expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-forest-500" />
          <span className="text-xs text-text-secondary">売上</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-terracotta-500" />
          <span className="text-xs text-text-secondary">経費</span>
        </div>
      </div>
    </div>
  );
}
