import React from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import type { VerificationDashboardCounts } from '../../types/issuingAuthority';

interface VerificationDashboardCardsProps {
  counts: VerificationDashboardCounts;
  selectedFilter: string; // 'ALL' | 'VERIFIED' | 'MISMATCH' | 'PENDING' | 'MANUAL_REVIEW'
  onSelectFilter: (filter: string) => void;
}

export const VerificationDashboardCards: React.FC<VerificationDashboardCardsProps> = ({
  counts,
  selectedFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Verification Requests',
      count: counts.totalRequests,
      subtext: 'Across all statutory documents',
      icon: FileCheck2,
      colorBg: 'bg-blue-50',
      colorText: 'text-[#2563EB]',
      borderColor: 'border-[#CFE2FE]',
      activeRing: 'ring-2 ring-[#2563EB]',
    },
    {
      id: 'VERIFIED',
      title: 'Verified Documents',
      count: counts.verifiedDocuments,
      subtext: 'Confirmed authentic by source/officer',
      icon: CheckCircle2,
      colorBg: 'bg-emerald-50',
      colorText: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'MISMATCH',
      title: 'Mismatch Detected',
      count: counts.mismatchDetected,
      subtext: 'Discrepancy with master registry',
      icon: AlertTriangle,
      colorBg: 'bg-rose-50',
      colorText: 'text-rose-600',
      borderColor: 'border-rose-200',
      activeRing: 'ring-2 ring-rose-500',
    },
    {
      id: 'PENDING',
      title: 'Pending Verification',
      count: counts.pendingVerification,
      subtext: 'Awaiting source or review response',
      icon: Clock,
      colorBg: 'bg-amber-50',
      colorText: 'text-amber-600',
      borderColor: 'border-amber-200',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'MANUAL_REVIEW',
      title: 'Manual Review Required',
      count: counts.manualReviewRequired,
      subtext: 'Officer scrutiny queue cases',
      icon: UserCheck,
      colorBg: 'bg-purple-50',
      colorText: 'text-purple-600',
      borderColor: 'border-purple-200',
      activeRing: 'ring-2 ring-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-4 rounded-3xl bg-white border ${card.borderColor} shadow-card transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden ${
              isSelected ? `${card.activeRing} bg-slate-50/60` : ''
            }`}
          >
            {/* Top Row: Icon & Filter indicator */}
            <div className="flex items-center justify-between mb-2.5">
              <div className={`w-10 h-10 rounded-2xl ${card.colorBg} ${card.colorText} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#102B4E] px-2 py-0.5 rounded-full">
                  Active Filter
                </span>
              )}
            </div>

            {/* Middle: Count */}
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {card.count}
            </div>

            {/* Bottom: Title & Subtext */}
            <div className="mt-1">
              <h4 className="text-xs font-bold text-slate-800 leading-snug">
                {card.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {card.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
