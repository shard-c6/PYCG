import { GDPDatabase, GDPResponse, GDPDataPoint } from './types';

// Client-side fetch helper for the static JSON public database
let cachedData: GDPDatabase | null = null;

export async function getGlobalData(): Promise<GDPDatabase> {
  if (cachedData) return cachedData;
  const res = await fetch('/data/gdp.json');
  if (!res.ok) throw new Error('Failed to load GDP data');
  cachedData = await res.json();
  return cachedData as GDPDatabase;
}

export async function getCountryData(code: string): Promise<GDPResponse | null> {
  const data = await getGlobalData();
  return data.countries[code.toUpperCase()] || null;
}

export async function getGlobalAverage(): Promise<GDPDataPoint[]> {
  const data = await getGlobalData();
  return data.globalAverage;
}
