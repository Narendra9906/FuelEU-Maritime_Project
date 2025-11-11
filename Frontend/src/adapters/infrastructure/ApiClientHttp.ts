import type { ApiClient } from "../../core/ports/ApiClient";
import type { Route, ComparisonResult } from "../../core/domain/types";
import { http } from "./httpClient";

export function makeApiClient(): ApiClient {
  return {
    async listRoutes(): Promise<Route[]> {
      return http.get<Route[]>("/routes");
    },
    async setBaseline(id: number): Promise<void> {
      await http.post(`/routes/${id}/baseline`);
    },
    async getComparison(): Promise<ComparisonResult> {
      return http.get<ComparisonResult>("/routes/comparison");
    },
  };
}
