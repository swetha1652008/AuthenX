import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Calendar, 
  Building 
} from 'lucide-react';
import type { ReportFilterOptions } from '../../types/reportsAnalytics';

interface SharedReportFiltersProps {
  filters: ReportFilterOptions;
  onChange: (updated: ReportFilterOptions) => void;
  onReset: () => void;
}

export const SharedReportFilters: React.FC<SharedReportFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.searchQuery || ''}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Filter report by Application ID, Institution..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
        />
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Academic Year */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.academicYear}
            onChange={(e) => onChange({ ...filters, academicYear: e.target.value })}
            className="bg-transparent font-medium focus:outline-none"
          >
            <option value="2026-27">AY 2026-27</option>
            <option value="2025-26">AY 2025-26</option>
          </select>
        </div>

        {/* Application Type */}
        <select
          value={filters.applicationType}
          onChange={(e) =>
            onChange({
              ...filters,
              applicationType: e.target.value as 'ALL' | 'EOA' | 'NEW' | 'CHANGE'
            })
          }
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none"
        >
          <option value="ALL">All Application Types</option>
          <option value="EOA">Extension of Approval (EoA)</option>
          <option value="NEW">New Institution</option>
          <option value="CHANGE">Change in Intake / Course</option>
        </select>

        {/* Region */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.region}
            onChange={(e) => onChange({ ...filters, region: e.target.value })}
            className="bg-transparent font-medium focus:outline-none"
          >
            <option value="ALL">All AICTE Regions</option>
            <option value="South-Western">South-Western Region</option>
            <option value="Western">Western Region</option>
            <option value="Southern">Southern Region</option>
            <option value="Northern">Northern Region</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
