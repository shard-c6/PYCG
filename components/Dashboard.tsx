'use client';

import { useEffect, useState } from 'react';
import { Country, GDPResponse } from '@/lib/types';
import { getCountryData } from '@/lib/data';
import GDPChart from './GDPChart';
import GrowthChart from './GrowthChart';
import MomentumMetrics from './MomentumMetrics';
import LocalClock from './LocalClock';
import TimelineSlider from './TimelineSlider';
import ReservesAnalysis from './ReservesAnalysis';
import SectorPerformance from './SectorPerformance';

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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-inter">
      {/* Dynamic Navigation Bar */}
      <header className="sticky top-0 w-full z-40 bg-[var(--surface-1)]/60 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <button 
              onClick={onBack}
              className="group flex items-center gap-3 text-white/40 hover:text-[var(--accent)] transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            </button>
            <div className="h-8 w-px bg-white/10" />
            <LocalClock timezone={country.timezone || 'UTC'} />
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white text-lg font-semibold tracking-tight">{data?.name || country.name}</span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest leading-none mt-1">Sovereign Data</span>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <a 
              href={`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'}/api/export/${data?.country}`}
              className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-[var(--accent)] hover:brightness-110 text-black text-sm font-semibold transition-all shadow-[0_0_20px_rgba(123,209,250,0.3)]"
            >
              <span>Export Dataset</span>
              <span className="opacity-50 font-normal">.CSV</span>
            </a>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-8 py-10 flex flex-col gap-8">
        {loading ? (
          <div className="grid grid-cols-12 gap-8 animate-pulse">
            <div className="col-span-12 h-40 bg-white/5 rounded-3xl" />
            <div className="col-span-8 h-[500px] bg-white/5 rounded-3xl" />
            <div className="col-span-4 h-[500px] bg-white/5 rounded-3xl" />
          </div>
        ) : (
          <>
            {/* Top Section: Hero & Key Stats */}
            <div className="grid grid-cols-12 gap-8">
              {/* GDP Hero Card */}
              <div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-[2rem] p-12 bg-gradient-to-br from-[var(--surface-1)] to-black border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/40">Macro Overview</span>
                  </div>
                  <div className="text-white/40 text-sm uppercase tracking-[0.3em] font-light mb-4">Nominal GDP in {activeYear}</div>
                  <div className="font-fira-code text-6xl md:text-8xl font-light text-[var(--accent)] tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(123,209,250,0.4)]">
                    {currentMetric ? formatCurrency(currentMetric.value) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
                <MetricCard label="Growth" value={data?.delta ? `${data.delta}%` : 'N/A'} />
                <MetricCard label="Per Capita" value={data?.per_capita ? `$${data.per_capita.toLocaleString()}` : 'N/A'} />
                <MetricCard label="Inflation" value={data?.inflation ? `${data.inflation}%` : 'N/A'} />
                <MetricCard label="Unemployment" value={data?.unemployment ? `${data.unemployment}%` : 'N/A'} />
              </div>
            </div>

            {/* Middle Section: Trends & AI Analytics */}
            <div className="grid grid-cols-12 gap-8">
              {/* Primary Visualizations */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                {/* GDP Trend Line */}
                <div className="bg-[var(--surface-1)] rounded-[2rem] p-10 border border-white/5 shadow-xl">
                  <header className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-medium text-white tracking-tight">GDP Growth Trend</h3>
                      <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Historical Performance (1995–2023)</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <LegendItem label="Direct GDP" color="var(--accent)" />
                      <LegendItem label="Global Avg" color="rgba(255,255,255,0.2)" dashed />
                    </div>
                  </header>
                  <div className="h-[400px] w-full">
                    <GDPChart 
                      countryData={data?.gdp || []} 
                      activeYear={activeYear}
                      countryCode={country.code}
                    />
                  </div>
                </div>

                {/* Growth Rate Bar Chart */}
                <div className="bg-[var(--surface-1)] rounded-[2rem] p-10 border border-white/5 shadow-xl">
                  <header className="mb-10">
                    <h3 className="text-xl font-medium text-white tracking-tight">Annual Growth Multiplier</h3>
                    <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Year-over-Year Percentage Change</p>
                  </header>
                  <div className="h-[250px] w-full">
                    <GrowthChart countryData={data?.gdp || []} />
                  </div>
                </div>
              </div>

              {/* AI & Analytics Sidebar */}
              <aside className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                {data?.analytics && (
                  <MomentumMetrics 
                    prediction={data.analytics.prediction_2030 || 0} 
                    momentum={data.analytics.momentum_score || 0}
                    model={data.analytics.forecasting_model || 'Standard'}
                  />
                )}
                <div className="bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full" />
                  <div>
                    <h4 className="text-white font-medium mb-4">Market Outlook</h4>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Based on current {data?.name} fiscal dynamics, the economy shows a {data?.analytics?.momentum_score ? (data.analytics.momentum_score > 100 ? 'positive' : 'divergent') : 'stable'} path. Recent adjustments in inflation ({data?.inflation}%) suggest active monetary intervention.
                    </p>
                  </div>
                  <div className="pt-8">
                    <TimelineSlider min={1995} max={2023} value={activeYear} onChange={onYearChange} />
                  </div>
                </div>

                {/* Sub-context modules to fill space */}
                <div className="flex-1 flex flex-col gap-8">
                  <SectorPerformance />
                </div>
              </aside>
            </div>

            {/* Bottom Section: Reserves Analysis */}
            <div className="mt-8">
              <ReservesAnalysis />
            </div>
          </>
        )}
      </main>
      
      <footer className="w-full py-12 border-t border-white/5 mt-20">
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-white/20">
          <span>&copy; 2026 GlobalLedger Systems v2.0.0-Production</span>
          <span>Source: World Bank / IMF Data Repositories</span>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  const isPositive = value.startsWith('+') || (parseFloat(value) > 0 && value.includes('%'));
  const isNegative = value.startsWith('-') || (parseFloat(value) < 0 && value.includes('%'));
  
  return (
    <div className="bg-[var(--surface-1)] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-center">
      <div className="text-white/30 text-[10px] uppercase tracking-widest mb-3">{label}</div>
      <div className={`font-fira-code text-2xl font-light tracking-tight ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function LegendItem({ label, color, dashed }: { label: string; color: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-4 h-1 rounded-full" 
        style={{ backgroundColor: color, borderStyle: dashed ? 'dashed' : 'solid', opacity: dashed ? 0.3 : 1 }} 
      />
      <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}
