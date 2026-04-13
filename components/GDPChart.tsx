'use client';

import React, { useEffect, useState } from 'react';
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

const GDPChart = React.memo(({ countryData, activeYear }: GDPChartProps) => {
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
      <LineChart data={mergedData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis 
          dataKey="year" 
          stroke="rgba(255,255,255,0.2)" 
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
          tickMargin={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.2)" 
          tickFormatter={formatYAxis} 
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--surface-3)', 
            border: '1px solid var(--border-ghost)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(10px)',
            fontSize: '12px'
          }}
          labelStyle={{ color: 'var(--text-muted)', marginBottom: '6px' }}
          formatter={(val: number, name: string) => [
            formatYAxis(val), 
            name === 'countryValue' ? 'Sovereign GDP' : 'Global Baseline'
          ]}
        />
        
        <ReferenceLine 
          x={activeYear} 
          stroke="var(--accent)" 
          strokeWidth={1}
          strokeDasharray="4 4" 
          opacity={0.3} 
        />

        <Line
          type="monotone"
          dataKey="globalValue"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1.5}
          strokeDasharray="6 6"
          dot={false}
          activeDot={false}
        />
        
        <Line
          type="monotone"
          dataKey="countryValue"
          stroke="var(--accent)"
          strokeWidth={3}
          dot={false}
          activeDot={{ 
            r: 6, 
            fill: 'var(--accent)', 
            stroke: 'black', 
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

GDPChart.displayName = 'GDPChart';

export default GDPChart;
