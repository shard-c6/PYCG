'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const forexReservesData = [
  { date: '2020-01', reserves_usd: 475000000000 },
  { date: '2021-01', reserves_usd: 585000000000 },
  { date: '2022-01', reserves_usd: 630000000000 },
  { date: '2023-01', reserves_usd: 595000000000 },
  { date: '2024-01', reserves_usd: 640000000000 },
];

const reserveCompositionData = [
  { type: 'USD & Other Currencies', value: 78 },
  { type: 'Gold', value: 12 },
  { type: 'SDR (Special Drawing Rights)', value: 6 },
  { type: 'IMF Reserve Position', value: 4 },
];

const importCoverData = [
  { country: 'India', months: 10 },
  { country: 'China', months: 14 },
  { country: 'Brazil', months: 8 },
  { country: 'United States', months: 3 },
  { country: 'Japan', months: 18 },
  { country: 'Germany', months: 6 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateLabel(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

function formatBillions(val: number): string {
  return `$${(val / 1_000_000_000).toFixed(0)}B`;
}

// ─── Info Tooltip ────────────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="reserves-info-icon"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      aria-label={text}
    >
      ℹ
      {show && (
        <span className="reserves-info-tooltip">{text}</span>
      )}
    </span>
  );
}

// ─── Chart Card Wrapper ──────────────────────────────────────────────────────

function ChartCard({
  title,
  infoText,
  source,
  children,
}: {
  title: string;
  infoText: string;
  source: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reserves-chart-card">
      <div className="reserves-chart-header">
        <h3 className="reserves-chart-title">{title}</h3>
        <InfoTooltip text={infoText} />
      </div>
      <div className="reserves-chart-body">{children}</div>
      <p className="reserves-chart-source">{source}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

declare global {
  interface Window {
    Chart: any;
  }
}

export default function ReservesAnalysis() {
  const forexCanvasRef = useRef<HTMLCanvasElement>(null);
  const compositionCanvasRef = useRef<HTMLCanvasElement>(null);
  const importCoverCanvasRef = useRef<HTMLCanvasElement>(null);

  const forexChartRef = useRef<any>(null);
  const compositionChartRef = useRef<any>(null);
  const importCoverChartRef = useRef<any>(null);

  const [chartJsLoaded, setChartJsLoaded] = useState(false);

  // Load Chart.js from CDN
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Chart) {
      setChartJsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    script.async = true;
    script.onload = () => setChartJsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove — other instances may still need it
    };
  }, []);

  // ── Chart 1: Forex Reserves Over Time (Line) ────────────────────────────
  useEffect(() => {
    if (!chartJsLoaded || !forexCanvasRef.current) return;
    const Chart = window.Chart;

    // Destroy previous instance
    if (forexChartRef.current) forexChartRef.current.destroy();

    const ctx = forexCanvasRef.current.getContext('2d');
    if (!ctx) return;

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(123, 209, 250, 0.35)');
    gradient.addColorStop(1, 'rgba(123, 209, 250, 0.02)');

    forexChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: forexReservesData.map(d => formatDateLabel(d.date)),
        datasets: [
          {
            label: 'Forex Reserves (USD)',
            data: forexReservesData.map(d => d.reserves_usd),
            borderColor: '#7bd1fa',
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#7bd1fa',
            pointBorderColor: '#0f172a',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' as const },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#94a3b8',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(123, 209, 250, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 12 },
            bodyFont: { size: 14, weight: 'bold' as const },
            callbacks: {
              label: (ctx: any) => formatBillions(ctx.parsed.y),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 12 } },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 12 },
              callback: (val: number) => formatBillions(val),
            },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      if (forexChartRef.current) forexChartRef.current.destroy();
    };
  }, [chartJsLoaded]);

  // ── Chart 2: Reserve Composition (Donut) ─────────────────────────────────
  useEffect(() => {
    if (!chartJsLoaded || !compositionCanvasRef.current) return;
    const Chart = window.Chart;

    if (compositionChartRef.current) compositionChartRef.current.destroy();

    const ctx = compositionCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const colors = ['#7bd1fa', '#f59e0b', '#a78bfa', '#f43f5e'];
    const hoverColors = ['#9bddfb', '#fbbf24', '#c4b5fd', '#fb7185'];

    compositionChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: reserveCompositionData.map(d => d.type),
        datasets: [
          {
            data: reserveCompositionData.map(d => d.value),
            backgroundColor: colors,
            hoverBackgroundColor: hoverColors,
            borderColor: '#0f172a',
            borderWidth: 3,
            hoverBorderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom' as const,
            labels: {
              color: '#94a3b8',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12,
              font: { size: 12 },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#94a3b8',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(123, 209, 250, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            bodyFont: { size: 14, weight: 'bold' as const },
            callbacks: {
              label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });

    return () => {
      if (compositionChartRef.current) compositionChartRef.current.destroy();
    };
  }, [chartJsLoaded]);

  // ── Chart 3: Import Cover by Country (Horizontal Bar) ────────────────────
  useEffect(() => {
    if (!chartJsLoaded || !importCoverCanvasRef.current) return;
    const Chart = window.Chart;

    if (importCoverChartRef.current) importCoverChartRef.current.destroy();

    const ctx = importCoverCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const barColors = importCoverData.map(d => {
      if (d.months >= 6) return '#22c55e';
      if (d.months >= 3) return '#f59e0b';
      return '#f43f5e';
    });

    const hoverBarColors = importCoverData.map(d => {
      if (d.months >= 6) return '#4ade80';
      if (d.months >= 3) return '#fbbf24';
      return '#fb7185';
    });

    importCoverChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: importCoverData.map(d => d.country),
        datasets: [
          {
            label: 'Months of Import Cover',
            data: importCoverData.map(d => d.months),
            backgroundColor: barColors,
            hoverBackgroundColor: hoverBarColors,
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 28,
          },
        ],
      },
      options: {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#94a3b8',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(123, 209, 250, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            bodyFont: { size: 14, weight: 'bold' as const },
            callbacks: {
              label: (ctx: any) => `${ctx.parsed.x} months`,
            },
          },
          // Custom plugin for the reference line annotation
          annotation: undefined, // handled via custom plugin below
        },
        scales: {
          x: {
            min: 0,
            max: 20,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#94a3b8',
              font: { size: 12 },
              stepSize: 4,
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#cbd5e1',
              font: { size: 13, weight: '500' as const },
            },
            border: { display: false },
          },
        },
      },
      plugins: [
        {
          id: 'thresholdLine',
          afterDraw: (chart: any) => {
            const { ctx: c, scales } = chart;
            const xScale = scales.x;
            const yScale = scales.y;

            const xPixel = xScale.getPixelForValue(3);
            const topY = yScale.top;
            const bottomY = yScale.bottom;

            c.save();
            c.setLineDash([6, 4]);
            c.strokeStyle = '#f43f5e';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(xPixel, topY - 10);
            c.lineTo(xPixel, bottomY + 10);
            c.stroke();

            // Label
            c.setLineDash([]);
            c.fillStyle = '#f43f5e';
            c.font = '11px "Fira Sans", sans-serif';
            c.textAlign = 'center';
            c.fillText('Minimum Safe', xPixel, topY - 22);
            c.fillText('Threshold', xPixel, topY - 10);
            c.restore();
          },
        },
      ],
    });

    return () => {
      if (importCoverChartRef.current) importCoverChartRef.current.destroy();
    };
  }, [chartJsLoaded]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="reserves-analysis-section">
      <div className="reserves-section-header">
        <h2 className="reserves-section-title">Reserves Analysis</h2>
        <div className="reserves-section-divider" />
        <p className="reserves-section-subtitle">
          Comprehensive overview of global foreign exchange reserves, composition breakdown, and import coverage metrics.
        </p>
      </div>

      <div className="reserves-grid">
        {/* Chart 1: Forex Reserves Over Time */}
        <ChartCard
          title="Forex Reserves Over Time"
          infoText="Tracks total foreign exchange reserves held by central banks over time, measured in USD."
          source="Source: World Bank — Total Reserves (FI.RES.TOTL.CD) | data.worldbank.org"
        >
          <div className="reserves-canvas-wrap reserves-canvas-wide">
            {chartJsLoaded ? (
              <canvas ref={forexCanvasRef} id="forex-reserves-chart" />
            ) : (
              <div className="reserves-loading">Loading chart…</div>
            )}
          </div>
        </ChartCard>

        {/* Chart 2: Reserve Composition */}
        <ChartCard
          title="Reserve Composition"
          infoText="Breakdown of global reserves by asset type — currencies, gold, SDRs, and IMF positions."
          source="Source: IMF COFER Dataset — Currency Composition of Official Foreign Exchange Reserves | data.imf.org"
        >
          <div className="reserves-canvas-wrap reserves-canvas-square">
            {chartJsLoaded ? (
              <canvas ref={compositionCanvasRef} id="reserve-composition-chart" />
            ) : (
              <div className="reserves-loading">Loading chart…</div>
            )}
          </div>
        </ChartCard>

        {/* Chart 3: Import Cover by Country */}
        <ChartCard
          title="Import Cover (Months of Imports Covered by Reserves)"
          infoText="Shows how many months of imports each country's reserves can finance, with 3 months as the minimum safe threshold."
          source="Source: World Bank — Total Reserves in Months of Imports (FI.RES.TOTL.MO) | data.worldbank.org"
        >
          <div className="reserves-canvas-wrap reserves-canvas-wide">
            {chartJsLoaded ? (
              <canvas ref={importCoverCanvasRef} id="import-cover-chart" />
            ) : (
              <div className="reserves-loading">Loading chart…</div>
            )}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
