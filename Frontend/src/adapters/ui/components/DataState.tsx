import React from "react";

export const Loading: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="text-gray-600 text-sm">{label}</div>
);

export const ErrorNote: React.FC<{ error: unknown }> = ({ error }) => (
  <div className="text-red-600 text-sm">
    {(error as Error)?.message || "Something went wrong"}
  </div>
);
