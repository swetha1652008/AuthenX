import React from 'react';
import { 
  Bell, 
  AlertOctagon, 
  FileWarning, 
  Globe2, 
  ShieldAlert, 
  Clock, 
  Hourglass, 
  CheckCircle2 
} from 'lucide-react';
import type { AlertsDashboardCounts } from '../../types/alertsAudit';

interface AlertsDashboardCardsProps {
  counts: AlertsDashboardCounts;
  activeFilter?: string;
  onFilterClick: (filter: string) => void;
}

export const AlertsDashboardCards: React.FC<AlertsDashboardCardsProps> = ({
  counts,
  activeFilter,
  onFilterClick,
}) => {
  const cards = [
    {
      id: 'ACTIVE',
      label: 'Total Active Alerts',
      value: counts.totalActiveAlerts,
      icon: Bell,
      color: 'blue',
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      activeBorder: 'border-blue-600 ring-2 ring-blue-500/20',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      id: 'CRITICAL_HIGH',
      label: 'Critical & High',
      value: counts.criticalHighAlerts,
      icon: AlertOctagon,
      color: 'rose',
      bg: 'bg-rose-50/70',
      border: 'border-rose-200',
      activeBorder: 'border-rose-600 ring-2 ring-rose-500/20',
      textColor: 'text-rose-700',
      iconColor: 'text-rose-600'
    },
    {
      id: 'DOCUMENT_ANOMALY',
      label: 'Document Anomalies',
      value: counts.documentAnomalyAlerts,
      icon: FileWarning,
      color: 'amber',
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      activeBorder: 'border-amber-600 ring-2 ring-amber-500/20',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600'
    },
    {
      id: 'AUTHORITY_MISMATCH',
      label: 'Authority Mismatches',
      value: counts.issuingAuthorityAlerts,
      icon: Globe2,
      color: 'purple',
      bg: 'bg-purple-50/70',
      border: 'border-purple-200',
      activeBorder: 'border-purple-600 ring-2 ring-purple-500/20',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      id: 'REGULATORY_DEFICIT',
      label: 'Regulatory Deficits',
      value: counts.regulatoryDeficitAlerts,
      icon: ShieldAlert,
      color: 'indigo',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-500/20',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'RECTIFICATION_OVERDUE',
      label: 'Overdue Notices',
      value: counts.overdueRectificationAlerts,
      icon: Clock,
      color: 'red',
      bg: 'bg-red-50/70',
      border: 'border-red-200',
      activeBorder: 'border-red-600 ring-2 ring-red-500/20',
      textColor: 'text-red-700',
      iconColor: 'text-red-600'
    },
    {
      id: 'AWAITING_ACTION',
      label: 'Awaiting Action',
      value: counts.awaitingActionAlerts,
      icon: Hourglass,
      color: 'orange',
      bg: 'bg-orange-50/70',
      border: 'border-orange-200',
      activeBorder: 'border-orange-600 ring-2 ring-orange-500/20',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    },
    {
      id: 'RESOLVED_30D',
      label: 'Resolved (30 Days)',
      value: counts.resolvedAlerts30Days,
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
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterClick(card.id)}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 bg-white hover:shadow-md ${
              isActive ? card.activeBorder : card.border
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`p-1 rounded-lg ${card.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
              </div>
            </div>
            <div className={`text-xl font-black ${card.textColor}`}>
              {card.value}
            </div>
          </button>
        );
      })}
    </div>
  );
};
