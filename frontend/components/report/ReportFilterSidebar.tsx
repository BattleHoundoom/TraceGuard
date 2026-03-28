"use client";

import { useState } from "react";
import type { Severity, SourceType } from "@/lib/api";

export interface ReportFilters {
  severity: Severity[];
  sourceType: SourceType[];
}

interface ReportFilterSidebarProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
}

const SEVERITIES: { id: Severity; label: string }[] = [
  { id: "CRITICAL", label: "CRITICAL (HIGH RISK)" },
  { id: "MODERATE", label: "MODERATE (AMBER)" },
  { id: "OBSERVATIONAL", label: "OBSERVATIONAL" },
];

const SOURCE_TYPES: { id: SourceType; label: string }[] = [
  { id: "DOMAIN_SQUATTING", label: "DOMAIN SQUATTING" },
  { id: "SOCIAL_MEDIA", label: "SOCIAL MEDIA" },
  { id: "E_COMMERCE", label: "E-COMMERCE" },
  { id: "NFT_CRYPTO", label: "NFT/CRYPTO" },
];


export default function ReportFilterSidebar({
  filters,
  onChange,
}: ReportFilterSidebarProps) {
  const toggleSeverity = (id: Severity) => {
    const next = filters.severity.includes(id)
      ? filters.severity.filter((s) => s !== id)
      : [...filters.severity, id];
    onChange({ ...filters, severity: next });
  };

  const toggleSourceType = (id: SourceType) => {
    const next = filters.sourceType.includes(id)
      ? filters.sourceType.filter((s) => s !== id)
      : [...filters.sourceType, id];
    onChange({ ...filters, sourceType: next });
  };

  return (
    <aside className="w-64 bg-[#0b0e14] p-6 overflow-y-auto space-y-8 border-r border-[#1d2026]/10 shrink-0">
      {/* Severity */}
      <div>
        <h3 className="font-label text-[10px] font-bold uppercase tracking-widest text-[#ffb000] mb-4">
          SEVERITY
        </h3>
        <div className="space-y-3">
          {SEVERITIES.map(({ id, label }) => (
            <label
              key={id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.severity.includes(id)}
                onChange={() => toggleSeverity(id)}
                className="w-4 h-4 bg-[#191c22] border-[#524533] text-[#ffb000] rounded-none focus:ring-0 accent-[#ffb000]"
              />
              <span className="text-xs text-[#d7c4ac] group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Source type */}
      <div>
        <h3 className="font-label text-[10px] font-bold uppercase tracking-widest text-[#ffb000] mb-4">
          SOURCE TYPE
        </h3>
        <div className="space-y-3">
          {SOURCE_TYPES.map(({ id, label }) => (
            <label
              key={id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.sourceType.includes(id)}
                onChange={() => toggleSourceType(id)}
                className="w-4 h-4 bg-[#191c22] border-[#524533] text-[#ffb000] rounded-none focus:ring-0 accent-[#ffb000]"
              />
              <span className="text-xs text-[#d7c4ac] group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}
