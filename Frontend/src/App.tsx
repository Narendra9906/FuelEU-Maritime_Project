import { useMemo, useState } from "react";
import { Tabs } from "./adapters/ui/components/Tabs";
import { makeApiClient } from "./adapters/infrastructure/ApiClientHttp";
import { RoutesTab } from "./adapters/ui/RoutesTab";
import { CompareTab } from "./adapters/ui/CompareTab";
import { BankingTab } from "./adapters/ui/BankingTab";
import { PoolingTab } from "./adapters/ui/PoolingTab";

type TabKey = "routes" | "compare" | "banking" | "pooling";

function App() {
  const [tab, setTab] = useState<TabKey>("routes");
  const api = useMemo(() => makeApiClient(), []);

  const tabs = [
    { key: "routes", label: "Routes" },
    { key: "compare", label: "Compare" },
    { key: "banking", label: "Banking" },
    { key: "pooling", label: "Pooling" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">Fuel EU Compliance Dashboard</h1>
        <p className="text-sm text-gray-600">Frontend (React + Tailwind) — Hexagonal adapters</p>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Tabs tabs={tabs} active={tab} onChange={(k) => setTab(k as TabKey)} />

        {tab === "routes" && <RoutesTab api={api} />}
        {tab === "compare" && <CompareTab api={api} />}
        {tab === "banking" && <BankingTab />}
        {tab === "pooling" && <PoolingTab />}
      </main>

      <footer className="p-4 text-xs text-gray-500 text-center">
        API Base: {import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}
      </footer>
    </div>
  );
}

export default App;
