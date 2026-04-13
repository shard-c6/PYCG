'use client';

import { motion } from 'framer-motion';

interface SectorData {
  name: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

const MOCK_SECTORS: SectorData[] = [
  { name: 'Financial Services', value: '+4.2%', trend: 'up' },
  { name: 'Manufacturing', value: '-0.8%', trend: 'down' },
  { name: 'Technology & AI', value: '+12.5%', trend: 'up' },
  { name: 'Agriculture', value: '+1.1%', trend: 'neutral' },
];

export default function SectorPerformance() {
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      
      <div className="flex flex-col gap-6 relative z-10">
        <div>
          <h4 className="text-white font-medium mb-1">Sector Dynamics</h4>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Industry Performance Matrix</p>
        </div>

        <div className="flex flex-col gap-4">
          {MOCK_SECTORS.map((sector, i) => (
            <motion.div 
              key={sector.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  sector.trend === 'up' ? 'bg-emerald-400' : 
                  sector.trend === 'down' ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
                <span className="text-white/60 text-xs font-medium">{sector.name}</span>
              </div>
              <span className={`font-fira-code text-xs font-semibold ${
                sector.trend === 'up' ? 'text-emerald-400' : 
                sector.trend === 'down' ? 'text-rose-400' : 'text-white'
              }`}>
                {sector.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/20">
            <span>Aggregated Sentiment</span>
            <span className="text-emerald-400/50">Positive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
