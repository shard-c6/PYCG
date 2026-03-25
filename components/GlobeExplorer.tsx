'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Country } from '@/lib/types';
import Dashboard from './Dashboard';
import TimelineSlider from './TimelineSlider';

// Lazy load the 3D scene so it only runs on the client
const GlobeScene = dynamic(() => import('./GlobeScene'), {
  ssr: false,
});

export default function GlobeExplorer() {
  const [view, setView] = useState<'globe' | 'dashboard'>('globe');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [activeYear, setActiveYear] = useState<number>(2023);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setView('dashboard');
  };

  const handleBack = () => {
    setView('globe');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[var(--bg)]">
      <AnimatePresence mode="wait">
        {view === 'globe' ? (
          <motion.div key="globe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-10"
          >
            {/* HUD Overlay */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none">
              <h1 className="text-2xl font-medium tracking-widest text-[var(--text-primary)]">GlobalLedger</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">Global GDP Explorer</p>
            </div>

            <div className="absolute bottom-8 left-8 z-20 pointer-events-none">
              <p className="text-sm text-[var(--text-soft)]">Click a country to explore dynamics</p>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl z-20">
              <TimelineSlider 
                min={1995} 
                max={2023} 
                value={activeYear} 
                onChange={setActiveYear} 
              />
            </div>

            {/* 3D Scene */}
            <GlobeScene
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              activeYear={activeYear}
            />
          </motion.div>
        ) : (
          <motion.div key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-20 bg-[var(--bg)] overflow-y-auto"
          >
            <Dashboard 
              country={selectedCountry} 
              onBack={handleBack} 
              activeYear={activeYear}
              onYearChange={setActiveYear}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
