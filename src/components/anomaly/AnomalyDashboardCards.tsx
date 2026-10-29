import React from 'react';
import { 
  Files, 
  Copy, 
  Layers, 
  FileWarning, 
  CalendarClock, 
  FileSearch, 
  UserCheck 
} from 'lucide-react';
import type { AnomalyDashboardMetrics } from '../../types/anomaly';

interface AnomalyDashboardCardsProps {
  metrics: AnomalyDashboardMetrics;
  selectedFilter: string | null;
  onSelectFilter: (filterKey: string | null) => void;
}

export const AnomalyDashboardCards: React.FC<AnomalyDashboardCardsProps> = ({
  metrics,
  selectedFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'all_docs',
      label: 'Documents Analyzed',
      value: metrics.documentsAnalyzed,
      icon: Files,
      color: 'blue',
      description: 'Ingested into application record',
      filterKey: 'ALL',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      activeRing: 'ring-2 ring-blue-500 border-blue-500',
    },
    {
      id: 'exact_dup',
      label: 'Exact Duplicate Matches',
      value: metrics.exactDuplicateMatches,
      icon: Copy,
      color: 'red',
      description: 'Identical SHA-256 byte payload',
      filterKey: 'Exact Duplicate',
      badgeBg: metrics.exactDuplicateMatches > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200',
      activeRing: 'ring-2 ring-red-500 border-red-500',
    },
    {
      id: 'possible_dup',
      label: 'Possible Duplicates',
      value: metrics.possibleDuplicateCandidates,
      icon: Layers,
      color: 'amber',
      description: 'Jaccard text similarity > 70%',
      filterKey: 'Possible Duplicate',
      badgeBg: metrics.possibleDuplicateCandidates > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200',
      activeRing: 'ring-2 ring-amber-500 border-amber-500',
    },
    {
      id: 'metadata_mismatch',
      label: 'Metadata Mismatches',
      value: metrics.metadataMismatches,
      icon: FileWarning,
      color: 'orange',
      description: 'Institution name/PID divergence',
      filterKey: 'Identifier Mismatch',
      badgeBg: metrics.metadataMismatches > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-500 border-slate-200',
      activeRing: 'ring-2 ring-orange-500 border-orange-500',
    },
    {
      id: 'date_inconsistency',
      label: 'Date Inconsistencies',
      value: metrics.dateInconsistencies,
      icon: CalendarClock,
      color: 'purple',
      description: 'Chronological/expiry lapses',
      filterKey: 'Date Inconsistency',
      badgeBg: metrics.dateInconsistencies > 0 ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-500 border-slate-200',
      activeRing: 'ring-2 ring-purple-500 border-purple-500',
    },
    {
      id: 'alteration_indicator',
      label: 'Alteration Indicators',
      value: metrics.alterationIndicators,
      icon: FileSearch,
      color: 'teal',
      description: 'Typography or field deviations',
      filterKey: 'Possible Alteration',
      badgeBg: metrics.alterationIndicators > 0 ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 text-slate-500 border-slate-200',
      activeRing: 'ring-2 ring-teal-500 border-teal-500',
    },
    {
      id: 'pending_review',
      label: 'Pending Human Reviews',
      value: metrics.pendingHumanReviews,
      icon: UserCheck,
      color: 'rose',
      description: 'Awaiting officer sign-off',
      filterKey: 'STATUS_PENDING',
      badgeBg: metrics.pendingHumanReviews > 0 ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold' : 'bg-slate-50 text-slate-500 border-slate-200',
      activeRing: 'ring-2 ring-rose-500 border-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.filterKey;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => {
              if (isSelected) {
                onSelectFilter(null); // toggle off
              } else {
                onSelectFilter(card.filterKey);
              }
            }}
            className={`text-left p-3.5 rounded-xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-2xs hover:shadow-xs ${
              isSelected ? card.activeRing : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-600 line-clamp-1">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.badgeBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#102B4E] tracking-tight">
                {card.value}
              </span>
              {isSelected && (
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  Filtered
                </span>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              {card.description}
            </p>

            <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all ${
              isSelected ? 'bg-blue-600' : 'bg-transparent group-hover:bg-slate-200'
            }`} />
          </button>
        );
      })}
    </div>
  );
};
