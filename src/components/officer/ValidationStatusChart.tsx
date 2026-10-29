import React from 'react';
import { PieChart } from 'lucide-react';

interface ValidationStatusChartProps {
  completedCount: number;
  pendingCount: number;
  requiringReviewCount: number;
  totalApplications: number;
}

export const ValidationStatusChart: React.FC<ValidationStatusChartProps> = ({
  completedCount,
  pendingCount,
  requiringReviewCount,
  totalApplications,
}) => {
  const completedPct = totalApplications > 0 ? Math.round((completedCount / totalApplications) * 100) : 0;
  const pendingPct = totalApplications > 0 ? Math.round((pendingCount / totalApplications) * 100) : 0;
  const reviewPct = totalApplications > 0 ? Math.round((requiringReviewCount / totalApplications) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#2563EB]" />
          <div>
            <h3 className="text-sm font-bold text-[#102B4E]">
              Validation Status Overview & Progress
            </h3>
            <p className="text-[11px] text-slate-500">
              Distribution of regulatory scrutiny progress across all registered institutional dossiers.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
          N = {totalApplications} Dossiers
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner mb-4">
        <div
          style={{ width: `${completedPct}%` }}
          className="bg-emerald-500 transition-all duration-500"
          title={`Completed: ${completedCount} (${completedPct}%)`}
        />
        <div
          style={{ width: `${reviewPct}%` }}
          className="bg-blue-600 transition-all duration-500"
          title={`Requiring Review: ${requiringReviewCount} (${reviewPct}%)`}
        />
        <div
          style={{ width: `${Math.max(0, 100 - completedPct - reviewPct)}%` }}
          className="bg-amber-400 transition-all duration-500"
          title={`Pending: ${pendingCount} (${pendingPct}%)`}
        />
      </div>

      {/* Metrics Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Completed */}
        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div>
              <span className="font-bold text-emerald-950 block">Validation Completed</span>
              <span className="text-[10px] text-emerald-700">{completedPct}% of total applications</span>
            </div>
          </div>
          <span className="text-lg font-black text-emerald-700">{completedCount}</span>
        </div>

        {/* Requiring Review */}
        <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <div>
              <span className="font-bold text-blue-950 block">Requiring Review</span>
              <span className="text-[10px] text-blue-700">{reviewPct}% under active evaluation</span>
            </div>
          </div>
          <span className="text-lg font-black text-blue-700">{requiringReviewCount}</span>
        </div>

        {/* Pending Scrutiny */}
        <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div>
              <span className="font-bold text-amber-950 block">Validation Pending</span>
              <span className="text-[10px] text-amber-700">{pendingPct}% awaiting rectification</span>
            </div>
          </div>
          <span className="text-lg font-black text-amber-700">{pendingCount}</span>
        </div>
      </div>
    </div>
  );
};
