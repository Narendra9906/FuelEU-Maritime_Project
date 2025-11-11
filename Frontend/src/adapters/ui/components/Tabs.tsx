import React from "react";

type TabKey = string;

type Tab = {
  key: TabKey;
  label: string;
};

type Props = {
  tabs: Tab[];
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export const Tabs: React.FC<Props> = ({ tabs, active, onChange }) => {
  return (
    <div className="border-b border-gray-200 mb-4">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium
                ${isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              onClick={() => onChange(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
