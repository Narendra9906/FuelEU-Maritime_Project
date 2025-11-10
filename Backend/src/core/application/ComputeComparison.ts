import type { Route } from "../domain";
import type { RouteRepository } from "../ports";
import { DomainError, InfraError, ROUND_DECIMALS, TARGET_2025 } from "../shared";

export type ComparisonItem = {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number; 
  compliant: boolean;  
};

export type ComputeComparisonOutput = {
  baseline: { routeId: string; ghgIntensity: number };
  others: ComparisonItem[];
};

const round = (n: number, d = 2) =>
  Math.round(n * Math.pow(10, d)) / Math.pow(10, d);

export interface ComputeComparison {
  execute(): Promise<ComputeComparisonOutput>;
}

export function createComputeComparison(repo: RouteRepository): ComputeComparison {
  return {
    async execute(): Promise<ComputeComparisonOutput> {
      try {
        const baseline = await repo.findBaseline();
        if (!baseline) throw new DomainError("No baseline set");
        if (baseline.ghgIntensity <= 0) {
          throw new DomainError("Baseline intensity must be > 0");
        }

        const all = await repo.findAll();
        const othersRaw = all.filter((r) => r.id !== baseline.id);

        const others = othersRaw
          .map<ComparisonItem>((r: Route) => {
            const percentDiffRaw =
              ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
            return {
              routeId: r.routeId,
              ghgIntensity: r.ghgIntensity,
              percentDiff: round(percentDiffRaw, ROUND_DECIMALS),
              compliant: r.ghgIntensity <= TARGET_2025,
            };
          })
          .sort((a, b) => a.routeId.localeCompare(b.routeId));

        return {
          baseline: { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity },
          others,
        };
      } catch (e: any) {
        if (e instanceof DomainError) throw e;
        throw new InfraError(e?.message ?? "ComputeComparison failed");
      }
    },
  };
}