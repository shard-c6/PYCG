'use client';

interface TimelineSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
}

export default function TimelineSlider({ value, min, max, onChange }: TimelineSliderProps) {
  const years = [1995, 2000, 2005, 2010, 2015, 2020, 2023];

  return (
    <div className="w-full max-w-3xl mx-auto backdrop-blur-md bg-[var(--surface-1)]/50 p-6 rounded-2xl border border-[var(--border-ghost)]">
      <div className="flex flex-col items-center">
        <div className="text-[var(--accent)] font-medium text-lg mb-4">{value}</div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 bg-[var(--surface-3)] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--accent)]"
        />
        <div className="w-full flex justify-between mt-2 text-xs text-[var(--text-muted)] font-medium">
          {years.map(y => (
            <span key={y} className={value === y ? 'text-[var(--text-primary)]' : ''}>{y}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
