import type { Route } from "../domain";
import type { RouteRepository } from "../ports";
import { InfraError } from "../shared";


export type ListRoutesInput = void;
export type ListRoutesOutput = Route[];


export interface ListRoutes {
  execute(): Promise<ListRoutesOutput>;
}

export function createListRoutes(repo: RouteRepository): ListRoutes {
  return {
    async execute(): Promise<ListRoutesOutput> {
      try {
        const routes = await repo.findAll();
        
        return [...routes].sort((a, b) => a.routeId.localeCompare(b.routeId));
      } catch (e: any) {
        throw new InfraError(e?.message ?? "ListRoutes failed");
      }
    },
  };
}
