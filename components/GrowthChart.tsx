'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { GDPDataPoint } from '@/lib/types';

interface GrowthChartProps {
  countryData: GDPDataPoint[];
}

export default function GrowthChart({ countryData }: GrowthChartProps) {
  // Calculate YoY Growth %
  const growthData = countryData.slice(1).map((current, index) => {
    const previous = countryData[index];
    const growth = ((current.value - previous.value) / previous.value) * 100;
    return {
      year: current.year,
      growth: parseFloat(growth.toFixed(2)),
    };
  });

  const formatYAxis = (tickValue: number) => `${tickValue}%`;

  if (growthData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={growthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="year" 
          stroke="var(--text-muted)" 
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
          tickMargin={10}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--text-muted)" 
          tickFormatter={formatYAxis} 
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--surface-3)', 
            border: '1px solid var(--border-ghost)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '12px'
          }}
          labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
          formatter={(val: number) => [`${val}%`, 'YoY Growth']}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="growth">
          {growthData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.growth >= 0 ? 'var(--accent-good)' : 'var(--error)'} 
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
