import React from 'react';
import { 
  FileCheck2, 
  ListChecks, 
  FolderCheck, 
  AlertTriangle, 
  HelpCircle, 
  Compass 
} from 'lucide-react';
import type { ComplianceDashboardCounts } from '../../types/compliance';

export type ComplianceFilterType =
  | 'ALL'
  | 'REQUIREMENTS'
  | 'EVIDENCE'
  | 'GAPS'
  | 'REQUESTS'
  | 'INSPECTIONS';

interface ComplianceOverviewCardsProps {
  counts: ComplianceDashboardCounts;
  selectedFilter: ComplianceFilterType;
  onSelectFilter: (filter: ComplianceFilterType) => void;
}

export const ComplianceOverviewCards: React.FC<ComplianceOverviewCardsProps> = ({
  counts,
  selectedFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'ALL' as ComplianceFilterType,
      title: 'Applications Assessed',
      count: counts.applicationsAssessed,
      subtitle: 'Active Scrutiny Dossiers',
      icon: FileCheck2,
      color: 'blue',
      borderColor: 'border-blue-200',
      activeBorder: 'border-[#2563EB] ring-2 ring-blue-100',
      iconBg: 'bg-blue-50 text-[#2563EB]',
    },
    {
      id: 'REQUIREMENTS' as ComplianceFilterType,
      title: 'Checklist Requirements',
      count: counts.checklistRequirements,
      subtitle: 'Configured Norms in Force',
      icon: ListChecks,
      color: 'indigo',
      borderColor: 'border-indigo-200',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-100',
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'EVIDENCE' as ComplianceFilterType,
      title: 'Evidence Submitted',
      count: counts.evidenceSubmitted,
      subtitle: 'Photos, Plans & Proofs',
      icon: FolderCheck,
      color: 'teal',
      borderColor: 'border-teal-200',
      activeBorder: 'border-teal-600 ring-2 ring-teal-100',
      iconBg: 'bg-teal-50 text-teal-600',
    },
    {
      id: 'GAPS' as ComplianceFilterType,
      title: 'Potential Compliance Gaps',
      count: counts.potentialGaps,
      subtitle: 'Deficiencies & Discrepancies',
      icon: AlertTriangle,
      color: 'rose',
      borderColor: 'border-rose-200',
      activeBorder: 'border-rose-600 ring-2 ring-rose-100',
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'REQUESTS' as ComplianceFilterType,
      title: 'Evidence Requests',
      count: counts.additionalEvidenceRequests,
      subtitle: 'Awaiting Clarification',
      icon: HelpCircle,
      color: 'amber',
      borderColor: 'border-amber-200',
      activeBorder: 'border-amber-600 ring-2 ring-amber-100',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'INSPECTIONS' as ComplianceFilterType,
      title: 'Inspection Recommendations',
      count: counts.inspectionRecommendationsPending,
      subtitle: 'Pending Committee Decision',
      icon: Compass,
      color: 'purple',
      borderColor: 'border-purple-200',
      activeBorder: 'border-purple-600 ring-2 ring-purple-100',
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-3.5 rounded-xl border bg-white transition shadow-sm hover:shadow-md cursor-pointer ${
              isSelected ? card.activeBorder : `${card.borderColor} hover:border-slate-300`
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-[#102B4E]">
                {card.count}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 line-clamp-1">{card.title}</p>
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{card.subtitle}</p>
          </button>
        );
      })}
    </div>
  );
};
