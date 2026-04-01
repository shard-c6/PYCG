import { GDPDatabase, GDPResponse, GDPDataPoint } from './types';

// API Configuration
const isProd = process.env.NODE_ENV === 'production';
const API_URL = isProd ? '' : 'http://localhost:8000';

let cachedData: GDPDatabase | null = null;

export async function getGlobalData(): Promise<GDPDatabase> {
  if (cachedData) return cachedData;
  try {
    const res = await fetch(`${API_URL}/api/data`);
    if (!res.ok) throw new Error('Backend not reachable. Ensure FastAPI is running.');
    cachedData = await res.json();
    return cachedData as GDPDatabase;
  } catch (error) {
    console.warn('Falling back to static dataset:', error);
    const res = await fetch('/data/gdp.json');
    return await res.json();
  }
}

export async function getCountryData(code: string): Promise<GDPResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/country/${code.toUpperCase()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('Falling back to static country data:', error);
    const data = await getGlobalData();
    return data.countries[code.toUpperCase()] || null;
  }
}

export async function getGlobalAverage(): Promise<GDPDataPoint[]> {
  try {
    const res = await fetch(`${API_URL}/api/stats/global-average`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const data = await getGlobalData();
    return data.globalAverage;
  }
}
