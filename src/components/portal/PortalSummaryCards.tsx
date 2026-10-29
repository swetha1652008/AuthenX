import React from 'react';
import { Files, FileText, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface PortalSummaryCardsProps {
  counts: {
    total: number;
    drafts: number;
    underReview: number;
    actionRequired: number;
  };
  selectedFilter: string;
  onFilterSelect: (filter: string) => void;
}

export const PortalSummaryCards: React.FC<PortalSummaryCardsProps> = ({
  counts,
  selectedFilter,
  onFilterSelect,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Applications',
      value: counts.total,
      subtitle: 'All cycles & change filings',
      icon: Files,
      color: 'blue',
      iconBg: 'bg-[#EAF2FF] text-[#2563EB] border-[#CFE2FE]',
      badge: 'All Records',
    },
    {
      id: 'DRAFT',
      title: 'Draft Applications',
      value: counts.drafts,
      subtitle: 'Pending submission completion',
      icon: FileText,
      color: 'slate',
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      badge: 'Unsubmitted',
    },
    {
      id: 'REVIEW',
      title: 'Under Review',
      value: counts.underReview,
      subtitle: 'Preliminary scrutiny in progress',
      icon: Clock,
      color: 'amber',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Active Scrutiny',
    },
    {
      id: 'ACTION',
      title: 'Action Required',
      value: counts.actionRequired,
      subtitle: 'Rectification & deficiencies flagged',
      icon: AlertTriangle,
      color: 'rose',
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'Attention Needed',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onFilterSelect(isSelected ? 'ALL' : c.id)}
            className={`p-5 rounded-2xl bg-white border transition-all text-left flex flex-col justify-between shadow-subtle hover:shadow-card cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
              isSelected
                ? 'border-2 border-[#2563EB] bg-[#F4F8FF]'
                : 'border-[#CFE2FE] hover:border-[#2563EB]/40'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border ${c.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {c.badge}
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#102B4E]">
                {c.value}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                {c.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{c.subtitle}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#2563EB]">
              <span>{isSelected ? 'Filter Active' : 'Filter by this status'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
