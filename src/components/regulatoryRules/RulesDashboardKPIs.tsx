import React from 'react';
import { 
  FileCode2, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  AlertOctagon, 
  ListChecks 
} from 'lucide-react';
import type { RegulatoryRulesDashboardKPIs } from '../../types/regulatoryRules';

interface Props {
  kpis: RegulatoryRulesDashboardKPIs;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const RulesDashboardKPIs: React.FC<Props> = ({
  kpis,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Codified Rules',
      value: kpis.totalRules,
      sub: 'AICTE APH 2026-27 Master Suite',
      icon: FileCode2,
      color: 'blue',
      borderColor: 'border-blue-500',
      activeRing: 'ring-2 ring-blue-500 bg-blue-50/50',
    },
    {
      id: 'PUBLISHED',
      title: 'Active Published Rules',
      value: kpis.publishedRules,
      sub: 'Enforcing In AI Pre-Validation',
      icon: CheckCircle2,
      color: 'emerald',
      borderColor: 'border-emerald-500',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50/50',
    },
    {
      id: 'UNDER_REVIEW',
      title: 'Rules In Scrutiny Review',
      value: kpis.pendingReviewRules,
      sub: 'Council Board Validation Queue',
      icon: Clock,
      color: 'amber',
      borderColor: 'border-amber-500',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/50',
    },
    {
      id: 'DRAFT',
      title: 'Draft Rule Definitions',
      value: kpis.draftRules,
      sub: 'Unpublished Local Specifications',
      icon: FileEdit,
      color: 'indigo',
      borderColor: 'border-indigo-500',
      activeRing: 'ring-2 ring-indigo-500 bg-indigo-50/50',
    },
    {
      id: 'CHECKLIST',
      title: 'Checklist Requirements',
      value: kpis.activeChecklistsCount,
      sub: 'Active Institutional Checklists',
      icon: ListChecks,
      color: 'teal',
      borderColor: 'border-teal-500',
      activeRing: 'ring-2 ring-teal-500 bg-teal-50/50',
    },
    {
      id: 'DEACTIVATED',
      title: 'Superseded / Inactive',
      value: kpis.deactivatedRules,
      sub: 'Archived AY Precedents',
      icon: AlertOctagon,
      color: 'slate',
      borderColor: 'border-slate-400',
      activeRing: 'ring-2 ring-slate-400 bg-slate-100/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectFilter(c.id)}
            className={`text-left p-4 rounded-xl border bg-white transition-all shadow-sm hover:shadow-md relative overflow-hidden ${
              isSelected ? c.activeRing : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
                {c.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-50 text-${c.color}-600`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#102B4E] tracking-tight mb-1">
              {c.value}
            </div>
            <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
              {c.sub}
            </p>
          </button>
        );
      })}
    </div>
  );
};
