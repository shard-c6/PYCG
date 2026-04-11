'use client';

import { useEffect, useState } from 'react';
import { Country, GDPResponse } from '@/lib/types';
import { getCountryData } from '@/lib/data';
import GDPChart from './GDPChart';
import TimelineSlider from './TimelineSlider';
import ReservesAnalysis from './ReservesAnalysis';

interface DashboardProps {
  country: Country | null;
  onBack: () => void;
  activeYear: number;
  onYearChange: (year: number) => void;
}

export default function Dashboard({ country, onBack, activeYear, onYearChange }: DashboardProps) {
  const [data, setData] = useState<GDPResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (country) {
      setLoading(true);
      getCountryData(country.code).then(d => {
        setData(d);
        setLoading(false);
      });
    }
  }, [country]);

  if (!country) return null;

  // Find data for active year
  const currentMetric = data?.gdp?.find(d => d.year === activeYear) || data?.gdp?.[data.gdp?.length - 1];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Sticky Header */}
      <header className="sticky top-0 w-full z-30 bg-[var(--surface-1)]/80 backdrop-blur-md border-b border-[var(--border-ghost)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm flex items-center gap-2"
          >
            ← Back to Globe
          </button>
          <div className="text-sm font-medium tracking-widest text-[var(--text-primary)]">GlobalLedger</div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-6 py-12 flex-1 flex flex-col gap-10">
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-[var(--surface-2)] rounded-2xl w-full" />
            <div className="grid grid-cols-4 gap-4"><div className="h-24 bg-[var(--surface-2)] rounded-xl" /></div>
            <div className="h-96 bg-[var(--surface-2)] rounded-2xl w-full" />
          </div>
        ) : (
          <>
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-[var(--surface-1)] via-[var(--bg)] to-black border border-[var(--border-ghost)] shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl md:text-5xl font-light text-[var(--text-primary)] tracking-tight">{data?.name}</h1>
                    <span className="px-3 py-1 rounded-full bg-[var(--surface-3)] text-xs font-semibold tracking-wider text-[var(--text-muted)]">{data?.name}</span>
                  </div>
                  <div className="text-[var(--text-muted)] text-sm uppercase tracking-widest mt-6">Nominal GDP ({activeYear})</div>
                  <div className="font-fira-code text-5xl md:text-6xl font-light text-[var(--accent)] tracking-tighter mt-2 shadow-[0_0_20px_rgba(123,209,250,0.3)]">
                    {currentMetric ? formatCurrency(currentMetric.value) : 'N/A'}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                   <a 
                    href={`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'}/api/export/${data?.country}`}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[var(--text-primary)] text-sm transition-all group"
                  >
                    <span>Download Dataset</span>
                    <span className="text-[var(--text-muted)] text-[10px] group-hover:text-white transition-colors">(.CSV)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="GDP Growth" value={data?.delta ? `${data.delta > 0 ? '+' : ''}${data.delta}%` : 'N/A'} />
              <MetricCard label="Per Capita" value={data?.per_capita ? `$${data.per_capita.toLocaleString()}` : 'N/A'} />
              <MetricCard label="Inflation" value={data?.inflation ? `${data.inflation}%` : 'N/A'} />
              <MetricCard label="Unemployment" value={data?.unemployment ? `${data.unemployment}%` : 'N/A'} />
            </div>

            {/* AI Insights Section */}
            {data?.analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-900/20 to-transparent p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <div className="text-indigo-300 text-xs uppercase tracking-wider">AI Projection (2030)</div>
                  </div>
                  <div className="font-fira-code text-3xl font-light text-white">
                    {formatCurrency(data.analytics.prediction_2030 || 0)}
                  </div>
                  <div className="text-[10px] text-indigo-400/60 mt-2 uppercase tracking-tight">Model: {data.analytics.forecasting_model}</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-900/20 to-transparent p-6 rounded-2xl border border-emerald-500/20 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-16 h-16 border-t-4 border-r-4 border-emerald-500 rotate-45" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="text-emerald-300 text-xs uppercase tracking-wider">Economic Momentum</div>
                  </div>
                  <div className="font-fira-code text-3xl font-light text-white">
                    {data.analytics.momentum_score}%
                  </div>
                  <div className="text-[10px] text-emerald-400/60 mt-2 uppercase tracking-tight">Relative to historical trend</div>
                </div>
              </div>
            )}

            {/* Chart Area */}
            <div className="bg-[var(--surface-2)] rounded-3xl p-8 border border-[var(--border-ghost)]">
              <div className="mb-6">
                <h3 className="text-lg font-medium tracking-wide text-[var(--text-primary)]">GDP Trend (1995–2023)</h3>
                <div className="flex items-center gap-6 mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-[2px] bg-[var(--accent)]" /> 
                    <span className="text-[var(--text-muted)]">{data?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-[2px] border-b border-dashed border-[var(--text-soft)]" /> 
                    <span className="text-[var(--text-muted)]">Global Average</span>
                  </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <GDPChart 
                  countryData={data?.gdp || []} 
                  activeYear={activeYear}
                  countryCode={country.code}
                />
              </div>
            </div>
            
            <div className="pt-4 pb-12 w-full flex justify-center">
               <TimelineSlider min={1995} max={2023} value={activeYear} onChange={onYearChange} />
            </div>

            {/* Reserves Analysis Section */}
            <ReservesAnalysis />
          </>
        )}
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: React.ReactNode }) {
  const isNegative = typeof value === 'string' && value.startsWith('-');
  const isPositive = typeof value === 'string' && value.startsWith('+');
  
  let valueColor = 'text-[var(--text-primary)]';
  if (isNegative) valueColor = 'text-[var(--error)]';
  if (isPositive) valueColor = 'text-[var(--accent-good)]';
  
  return (
    <div className="group cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:border-slate-600 transition-all duration-300 bg-[var(--surface-2)] p-6 rounded-2xl border border-[var(--border-ghost)] flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2 group-hover:text-[var(--text-soft)] transition-colors">{label}</div>
      <div className={`font-fira-code text-2xl font-normal tracking-tight ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}
