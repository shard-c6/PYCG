export interface Country {
  name: string;
  code: string;
  lat: number;
  lng: number;
}

export interface GDPDataPoint {
  year: number;
  value: number;
}

export interface GDPResponse {
  country: string;
  name: string;
  gdp: GDPDataPoint[];
  growth: number;
  per_capita: number;
  inflation: number;
  unemployment: number;
  currency: string;
  data_year: number;
  delta?: number;
  analytics?: {
    prediction_2030?: number;
    momentum_score?: number;
    forecasting_model?: string;
  };
}

export interface GDPDatabase {
  countries: Record<string, GDPResponse>;
  globalAverage: GDPDataPoint[];
}
