import "dotenv/config";
import { getPool } from "@/infrastructure/db/pool";
import { makePostgresRouteRepository } from "@/adapters/outbound/postgres";
import { createListRoutes, createComputeComparison, createSetBaseline } from "@/core/application";
import type { Route } from "@/core/domain";

console.log("DATABASE_URL =", process.env.DATABASE_URL || "(undefined)");


async function main() {
  const pool = getPool();
  const repo = makePostgresRouteRepository(pool);
  // quick connectivity check to provide a friendlier error when Postgres isn't available
  try {
    await pool.query("SELECT 1");
  } catch (err: any) {
    console.error("Postgres connection failed:", err?.message || err);
    console.error("Hint: Start the database (docker-compose is provided in Backend/docker-compose.yml)");
    console.error("Try: cd Backend && docker-compose up -d db");
    process.exit(1);
  }

  console.log("== findAll ==");
  const routes: Route[] = await repo.findAll();
  console.table(
    routes.map((r: Route) => ({
      id: r.id,
      routeId: r.routeId,
      ghg: r.ghgIntensity,
      baseline: r.isBaseline,
    }))
  );

  console.log("== findBaseline ==");
  const baseline = await repo.findBaseline();
  console.log(baseline);

  console.log("== use-case: ListRoutes ==");
  const listRoutes = createListRoutes(repo);
  const listed: Route[] = await listRoutes.execute();
  console.table(listed.map((r: Route) => ({ routeId: r.routeId, baseline: r.isBaseline })));

  console.log("== use-case: ComputeComparison ==");
  const compare = createComputeComparison(repo);
  console.log(await compare.execute());

  console.log("== use-case: SetBaseline (switch to another id) ==");
  const targetId = routes.find((r: Route) => !r.isBaseline)?.id ?? routes[0].id;
  const setBaseline = createSetBaseline(repo);
  await setBaseline.execute({ id: targetId });
  console.log("Baseline switched to id:", targetId);

  console.log("== verify baseline switched ==");
  const after: Route[] = await repo.findAll();
  console.table(after.map((r: Route) => ({ id: r.id, routeId: r.routeId, baseline: r.isBaseline })));

  await pool.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
