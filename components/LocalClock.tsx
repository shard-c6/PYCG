'use client';

import { useEffect, useState } from 'react';

interface LocalClockProps {
  timezone: string;
}

export default function LocalClock({ timezone }: LocalClockProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="flex flex-col">
      <div className="text-[var(--text-muted)] text-[10px] uppercase tracking-[0.2em] mb-1">Local Time</div>
      <div className="font-fira-code text-xl font-light text-[var(--accent)] tabular-nums">
        {time || '00:00:00 AM'}
      </div>
    </div>
  );
}
