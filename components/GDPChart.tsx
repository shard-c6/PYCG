'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { GDPDataPoint } from '@/lib/types';
import { getGlobalAverage } from '@/lib/data';

interface GDPChartProps {
  countryData: GDPDataPoint[];
  activeYear: number;
  countryCode: string;
}

export default function GDPChart({ countryData, activeYear }: GDPChartProps) {
  const [globalAvg, setGlobalAvg] = useState<GDPDataPoint[]>([]);

  useEffect(() => {
    getGlobalAverage().then(setGlobalAvg);
  }, []);

  const mergedData = countryData.map(cd => {
    const ga = globalAvg.find(g => g.year === cd.year);
    return {
      year: cd.year,
      countryValue: cd.value,
      globalValue: ga?.value || 0
    };
  });

  const formatYAxis = (tick: number) => {
    if (tick === 0) return '0';
    if (tick >= 1e12) return `$${(tick / 1e12).toFixed(1)}T`;
    if (tick >= 1e9) return `$${(tick / 1e9).toFixed(1)}B`;
    return `$${tick}`;
  };

  if (mergedData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mergedData} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="year" 
          stroke="var(--text-muted)" 
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
          tickMargin={10}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--text-muted)" 
          tickFormatter={formatYAxis} 
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--surface-3)', 
            border: '1px solid var(--border-ghost)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}
          labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
          formatter={(val: number, name: string) => [
            formatYAxis(val), 
            name === 'countryValue' ? 'Country GDP' : 'Global Avg'
          ]}
        />
        
        {/* Active Year Guide */}
        <ReferenceLine 
          x={activeYear} 
          stroke="var(--text-soft)" 
          strokeDasharray="3 3" 
          opacity={0.5} 
        />

        <Line
          type="monotone"
          dataKey="globalValue"
          stroke="var(--text-soft)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          activeDot={false}
        />
        
        <Line
          type="monotone"
          dataKey="countryValue"
          stroke="var(--accent)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6, fill: 'var(--surface-2)', stroke: 'var(--accent)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
