import React, { useEffect, useState } from "react";
import type { ApiClient } from "../../core/ports/ApiClient";
import type { ComparisonResult } from "../../core/domain/types";
import { ErrorNote, Loading } from "./components/DataState";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

type Props = { api: ApiClient };

export const CompareTab: React.FC<Props> = ({ api }) => {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.getComparison();
        setData(res);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  if (loading) return <Loading />;
  if (err) return <ErrorNote error={err} />;
  if (!data) return null;

  const chartData = [
    { name: data.baseline.routeId, ghg: data.baseline.ghgIntensity, type: "Baseline" },
    ...data.others.map(o => ({ name: o.routeId, ghg: o.ghgIntensity, type: "Comparison" })),
  ];

  return (
    <div className="space-y-4">
      <div className="rounded border p-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Route</th>
              <th className="px-3 py-2 text-left">ghgIntensity (gCO₂e/MJ)</th>
              <th className="px-3 py-2 text-left">% difference</th>
              <th className="px-3 py-2 text-left">Compliant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t bg-gray-50">
              <td className="px-3 py-2">{data.baseline.routeId} (baseline)</td>
              <td className="px-3 py-2">{data.baseline.ghgIntensity.toFixed(2)}</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">—</td>
            </tr>
            {data.others.map((o) => (
              <tr key={o.routeId} className="border-t">
                <td className="px-3 py-2">{o.routeId}</td>
                <td className="px-3 py-2">{o.ghgIntensity.toFixed(2)}</td>
                <td className="px-3 py-2">{o.percentDiff.toFixed(2)}%</td>
                <td className="px-3 py-2">{o.compliant ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-80 rounded border p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "gCO₂e/MJ", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="ghg" name="GHG Intensity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
