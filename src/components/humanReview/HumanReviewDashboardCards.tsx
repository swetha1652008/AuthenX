import React from 'react';
import { 
  Clock, 
  AlertOctagon, 
  Send, 
  Hourglass, 
  FileCheck2, 
  RefreshCw, 
  CheckCircle2 
} from 'lucide-react';
import type { HumanReviewDashboardStats } from '../../types/humanReview';

interface HumanReviewDashboardCardsProps {
  stats: HumanReviewDashboardStats;
  activeFilter?: string;
  onFilterClick: (filter: string) => void;
}

export const HumanReviewDashboardCards: React.FC<HumanReviewDashboardCardsProps> = ({
  stats,
  activeFilter,
  onFilterClick,
}) => {
  const cards = [
    {
      id: 'PENDING',
      label: 'Reviews Pending',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'blue',
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      activeBorder: 'border-blue-600 ring-2 ring-blue-500/20',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      id: 'HIGH_PRIORITY',
      label: 'High Priority Cases',
      value: stats.highPriorityCases,
      icon: AlertOctagon,
      color: 'rose',
      bg: 'bg-rose-50/70',
      border: 'border-rose-200',
      activeBorder: 'border-rose-600 ring-2 ring-rose-500/20',
      textColor: 'text-rose-700',
      iconColor: 'text-rose-600'
    },
    {
      id: 'RECTIFICATION_REQUESTED',
      label: 'Rectifications Sent',
      value: stats.rectificationRequestsSent,
      icon: Send,
      color: 'amber',
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      activeBorder: 'border-amber-600 ring-2 ring-amber-500/20',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600'
    },
    {
      id: 'AWAITING_RESPONSE',
      label: 'Awaiting Response',
      value: stats.awaitingInstitutionResponse,
      icon: Hourglass,
      color: 'orange',
      bg: 'bg-orange-50/70',
      border: 'border-orange-200',
      activeBorder: 'border-orange-600 ring-2 ring-orange-500/20',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    },
    {
      id: 'RECTIFICATIONS_SUBMITTED',
      label: 'Responses Received',
      value: stats.rectificationsSubmitted,
      icon: FileCheck2,
      color: 'teal',
      bg: 'bg-teal-50/70',
      border: 'border-teal-200',
      activeBorder: 'border-teal-600 ring-2 ring-teal-500/20',
      textColor: 'text-teal-700',
      iconColor: 'text-teal-600'
    },
    {
      id: 'REVALIDATION_PENDING',
      label: 'Re-validation Pending',
      value: stats.revalidationPending,
      icon: RefreshCw,
      color: 'indigo',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-500/20',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'COMPLETED',
      label: 'Reviews Completed',
      value: stats.reviewsCompleted,
      icon: CheckCircle2,
      color: 'emerald',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterClick(card.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 bg-white hover:shadow-md ${
              isActive ? card.activeBorder : card.border
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
              </div>
            </div>
            <div className={`text-2xl font-black ${card.textColor}`}>
              {card.value}
            </div>
          </button>
        );
      })}
    </div>
  );
};
