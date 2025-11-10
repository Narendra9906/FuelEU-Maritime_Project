export type Route = {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelTons: number;     // t
  distanceKm: number;   // km
  totalEmisT: number;   // t
  isBaseline: boolean;
};

export type ComparisonItem = {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export type ComparisonResult = {
  baseline: { routeId: string; ghgIntensity: number };
  others: ComparisonItem[];
};
