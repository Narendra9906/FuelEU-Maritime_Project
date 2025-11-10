import type { RouteRepository } from "../ports";
import { InfraError, NotFoundError } from "../shared";

export type SetBaselineInput = { id: number };
export type SetBaselineOutput = { baselineId: number };


export interface SetBaseline {
  execute(input: SetBaselineInput): Promise<SetBaselineOutput>;
}

export function createSetBaseline(repo: RouteRepository): SetBaseline {
  return {
    async execute({ id }: SetBaselineInput): Promise<SetBaselineOutput> {
      const route = await repo.findById(id);
      if (!route) throw new NotFoundError("route");
      if (route.isBaseline) return { baselineId: id }; // idempotent
      try {
        await repo.setBaselineById(id);
        return { baselineId: id };
      } catch (e: any) {
        throw new InfraError(e?.message ?? "SetBaseline failed");
      }
    },
  };
}
