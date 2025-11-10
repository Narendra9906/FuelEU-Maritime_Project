import type { Route, ComparisonResult } from "../domain/types";

export interface ApiClient {
  listRoutes(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getComparison(): Promise<ComparisonResult>;
}
