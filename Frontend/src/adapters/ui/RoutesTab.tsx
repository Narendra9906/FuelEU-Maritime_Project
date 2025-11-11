import React, { useEffect, useMemo, useState } from "react";
import type { ApiClient } from "../../core/ports/ApiClient";
import type { Route } from "../../core/domain/types";
import { ErrorNote, Loading } from "./components/DataState";

type Props = { api: ApiClient };

export const RoutesTab: React.FC<Props> = ({ api }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<unknown>(null);

  const [vessel, setVessel] = useState<string>("all");
  const [fuel, setFuel] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.listRoutes();
        setRoutes(data);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  const vessels = useMemo(
    () => ["all", ...Array.from(new Set(routes.map(r => r.vesselType)))],
    [routes]
  );
  const fuels = useMemo(
    () => ["all", ...Array.from(new Set(routes.map(r => r.fuelType)))],
    [routes]
  );
  const years = useMemo(
    () => ["all", ...Array.from(new Set(routes.map(r => String(r.year))))],
    [routes]
  );

  const filtered = routes.filter(r =>
    (vessel === "all" || r.vesselType === vessel) &&
    (fuel === "all" || r.fuelType === fuel) &&
    (year === "all" || String(r.year) === year)
  );

  const setBaseline = async (id: number) => {
    try {
      setSubmitting(id);
      await api.setBaseline(id);
      const data = await api.listRoutes(); // refresh
      setRoutes(data);
    } catch (e) {
      setErr(e);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <Loading />;
  if (err) return <ErrorNote error={err} />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="border rounded px-3 py-2" value={vessel} onChange={(e) => setVessel(e.target.value)}>
          {vessels.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={fuel} onChange={(e) => setFuel(e.target.value)}>
          {fuels.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={year} onChange={(e) => setYear(e.target.value)}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">routeId</th>
              <th className="px-3 py-2">vesselType</th>
              <th className="px-3 py-2">fuelType</th>
              <th className="px-3 py-2">year</th>
              <th className="px-3 py-2">ghgIntensity</th>
              <th className="px-3 py-2">fuelTons</th>
              <th className="px-3 py-2">distanceKm</th>
              <th className="px-3 py-2">totalEmisT</th>
              <th className="px-3 py-2">baseline</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.routeId}</td>
                <td className="px-3 py-2">{r.vesselType}</td>
                <td className="px-3 py-2">{r.fuelType}</td>
                <td className="px-3 py-2">{r.year}</td>
                <td className="px-3 py-2">{r.ghgIntensity.toFixed(2)}</td>
                <td className="px-3 py-2">{r.fuelTons}</td>
                <td className="px-3 py-2">{r.distanceKm}</td>
                <td className="px-3 py-2">{r.totalEmisT}</td>
                <td className="px-3 py-2">{r.isBaseline ? "✅" : ""}</td>
                <td className="px-3 py-2">
                  <button
                    className="rounded bg-blue-600 text-white px-3 py-1 disabled:opacity-50"
                    disabled={r.isBaseline || submitting === r.id}
                    onClick={() => setBaseline(r.id)}
                  >
                    {submitting === r.id ? "Setting..." : "Set Baseline"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-gray-500" colSpan={10}>No routes match the filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
