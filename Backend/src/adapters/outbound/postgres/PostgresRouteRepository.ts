import type { Route } from "../../../core/domain";
import type { RouteRepository } from "../../../core/ports";
import { InfraError, NotFoundError } from "../../../core/shared";
import { getPool, withTransaction } from "../../../infrastructure/db/pool";
import { Pool } from "pg";


function mapRow(r: any): Route {
  return {
    id: r.id,
    routeId: r.route_id,
    vesselType: r.vessel_type,
    fuelType: r.fuel_type,
    year: Number(r.year),
    ghgIntensity: Number(r.ghg_intensity),
    fuelTons: Number(r.fuel_tons),
    distanceKm: Number(r.distance_km),
    totalEmisT: Number(r.total_emis_t),
    isBaseline: Boolean(r.is_baseline),
  };
}

export function makePostgresRouteRepository(pool: Pool = getPool()): RouteRepository {
  return {
    async findAll() {
      try {
        const { rows } = await pool.query(
          `SELECT id, route_id, vessel_type, fuel_type, year, ghg_intensity,
                  fuel_tons, distance_km, total_emis_t, is_baseline
             FROM routes;`
        );
        return rows.map(mapRow);
      } catch (e: any) {
        throw new InfraError(e?.message ?? "findAll failed");
      }
    },

    async findById(id: number) {
      try {
        const { rows } = await pool.query(
          `SELECT id, route_id, vessel_type, fuel_type, year, ghg_intensity,
                  fuel_tons, distance_km, total_emis_t, is_baseline
             FROM routes
            WHERE id = $1;`,
          [id]
        );
        if (rows.length === 0) return null;
        return mapRow(rows[0]);
      } catch (e: any) {
        throw new InfraError(e?.message ?? "findById failed");
      }
    },

    async findBaseline() {
      try {
        const { rows } = await pool.query(
          `SELECT id, route_id, vessel_type, fuel_type, year, ghg_intensity,
                  fuel_tons, distance_km, total_emis_t, is_baseline
             FROM routes
            WHERE is_baseline = TRUE;`
        );
        if (rows.length === 0) return null;
        return mapRow(rows[0]);
      } catch (e: any) {
        throw new InfraError(e?.message ?? "findBaseline failed");
      }
    },

    async setBaselineById(id: number) {
      try {
        await withTransaction(async (client) => {
          await client.query(`UPDATE routes SET is_baseline = FALSE WHERE is_baseline = TRUE;`);
          const res = await client.query(
            `UPDATE routes SET is_baseline = TRUE WHERE id = $1;`,
            [id]
          );
          if (res.rowCount === 0) {
            throw new NotFoundError("route");
          }
        });
      } catch (e: any) {
        if (e instanceof NotFoundError) throw e;
        throw new InfraError(e?.message ?? "setBaselineById failed");
      }
    },
  };
}
