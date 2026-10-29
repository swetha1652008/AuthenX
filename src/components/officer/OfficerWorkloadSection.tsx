import React from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import type { OfficerWorkloadStats } from '../../types/officerDashboard';

interface OfficerWorkloadSectionProps {
  stats: OfficerWorkloadStats;
  onFilterClick: (filterType: 'ALL' | 'COMPLETED' | 'PENDING') => void;
  activeFilter?: 'ALL' | 'COMPLETED' | 'PENDING';
}

export const OfficerWorkloadSection: React.FC<OfficerWorkloadSectionProps> = ({
  stats,
  onFilterClick,
  activeFilter = 'ALL',
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Applications */}
      <button
        type="button"
        onClick={() => onFilterClick('ALL')}
        className={`p-4 rounded-xl border text-left bg-white transition shadow-sm hover:shadow-md cursor-pointer ${
          activeFilter === 'ALL'
            ? 'border-[#2563EB] ring-2 ring-blue-100'
            : 'border-slate-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-[#102B4E]">
            {stats.totalApplications}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-900">Total Applications in System</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Active technical institution dossiers for AY 2026-2027
        </p>
      </button>

      {/* Validation Completed */}
      <button
        type="button"
        onClick={() => onFilterClick('COMPLETED')}
        className={`p-4 rounded-xl border text-left bg-white transition shadow-sm hover:shadow-md cursor-pointer ${
          activeFilter === 'COMPLETED'
            ? 'border-emerald-600 ring-2 ring-emerald-100'
            : 'border-slate-200 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-emerald-700">
            {stats.validationCompleted}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-900">Validation Completed</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Verified by statutory authorities or scrutiny completed
        </p>
      </button>

      {/* Validation Pending */}
      <button
        type="button"
        onClick={() => onFilterClick('PENDING')}
        className={`p-4 rounded-xl border text-left bg-white transition shadow-sm hover:shadow-md cursor-pointer ${
          activeFilter === 'PENDING'
            ? 'border-amber-600 ring-2 ring-amber-100'
            : 'border-slate-200 hover:border-amber-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-amber-700">
            {stats.validationPending}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-900">Validation Pending Scrutiny</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Requires officer evaluation or institutional rectification
        </p>
      </button>
    </div>
  );
};
