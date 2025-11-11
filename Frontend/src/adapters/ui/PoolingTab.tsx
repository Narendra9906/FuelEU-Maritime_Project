import React from "react";

export const PoolingTab: React.FC = () => {
  return (
    <div className="rounded border p-4 text-sm text-gray-600">
      Pooling UI will be enabled once backend endpoints are ready (Day 3).
      <ul className="list-disc list-inside mt-2">
        <li>GET /compliance/adjusted-cb?year=YYYY</li>
        <li>POST /pools</li>
      </ul>
    </div>
  );
};
