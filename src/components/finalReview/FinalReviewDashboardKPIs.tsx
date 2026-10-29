import React from 'react';
import { 
  FileCheck2, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Gavel 
} from 'lucide-react';
import type { FinalReviewDashboardKPIs as FinalReviewKPIsData } from '../../types/finalReview';

interface Props {
  kpis: FinalReviewKPIsData;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const FinalReviewDashboardKPIs: React.FC<Props> = ({
  kpis,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Applications',
      value: kpis.totalUnderReview,
      sub: 'Under Scrutiny Directorate',
      icon: FileCheck2,
      color: 'blue',
      activeRing: 'ring-2 ring-blue-500 bg-blue-50/50',
    },
    {
      id: 'READY',
      title: 'Ready for Scrutiny',
      value: kpis.readyForOfficerReview,
      sub: 'Completeness >= 80%',
      icon: CheckCircle2,
      color: 'emerald',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50/50',
    },
    {
      id: 'PENDING_VERIFY',
      title: 'Pending Verification',
      value: kpis.pendingVerification,
      sub: 'Issuing Authority / QR',
      icon: Clock,
      color: 'amber',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/50',
    },
    {
      id: 'DISCREPANCIES',
      title: 'Open Discrepancies',
      value: kpis.unresolvedDiscrepancies,
      sub: 'Cross-Module Gaps',
      icon: ShieldAlert,
      color: 'rose',
      activeRing: 'ring-2 ring-rose-500 bg-rose-50/50',
    },
    {
      id: 'CLARIFICATIONS',
      title: 'Evidence Requests',
      value: kpis.evidenceRequestsPending,
      sub: 'Awaiting Campus Response',
      icon: HelpCircle,
      color: 'purple',
      activeRing: 'ring-2 ring-purple-500 bg-purple-50/50',
    },
    {
      id: 'AWAITING_DECISION',
      title: 'Awaiting Decision',
      value: kpis.awaitingAuthorizedDecision,
      sub: 'Official Scrutiny Verdict',
      icon: Gavel,
      color: 'indigo',
      activeRing: 'ring-2 ring-indigo-500 bg-indigo-50/50',
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
              <Icon className="w-4 h-4 text-slate-400" />
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
