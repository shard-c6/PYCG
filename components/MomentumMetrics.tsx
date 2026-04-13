'use client';

import { motion } from 'framer-motion';

interface MomentumMetricsProps {
  prediction: number;
  momentum: number;
  model: string;
}

export default function MomentumMetrics({ prediction, momentum, model }: MomentumMetricsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* AI Projection Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900/10 to-transparent p-6 rounded-2xl border border-indigo-500/20 relative overflow-hidden group shadow-lg"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <div className="text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-medium">AI Projection (2030)</div>
        </div>
        <div className="font-fira-code text-3xl font-light text-white tracking-tighter">
          {formatCurrency(prediction)}
        </div>
        <div className="text-[10px] text-indigo-400/50 mt-4 flex items-center justify-between border-t border-indigo-500/10 pt-3">
          <span className="uppercase tracking-wider">Engine</span>
          <span className="font-medium text-indigo-300">{model}</span>
        </div>
      </motion.div>
      
      {/* Economic Momentum Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-900/10 to-transparent p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden group shadow-lg"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <div className="w-20 h-20 border-t-4 border-r-4 border-emerald-500 rotate-45" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <div className="text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-medium">Economic Momentum</div>
        </div>
        <div className="font-fira-code text-3xl font-light text-white tracking-tighter">
          {momentum}%
        </div>
        <div className="text-[10px] text-emerald-400/50 mt-4 flex items-center justify-between border-t border-emerald-500/10 pt-3">
          <span className="uppercase tracking-wider">Status</span>
          <span className={`font-medium ${momentum >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {momentum >= 100 ? 'Outperforming' : 'Decelerating'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
