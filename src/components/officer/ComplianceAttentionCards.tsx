import React from 'react';
import { 
  FileQuestion, 
  AlertTriangle, 
  Eye, 
  CalendarX, 
  ChevronRight 
} from 'lucide-react';
import type { ComplianceAttentionStats } from '../../types/officerDashboard';

interface ComplianceAttentionCardsProps {
  stats: ComplianceAttentionStats;
  onSelectIndicator: (indicatorType: 'MISSING' | 'DISCREPANCIES' | 'REVIEW' | 'EXPIRED') => void;
}

export const ComplianceAttentionCards: React.FC<ComplianceAttentionCardsProps> = ({
  stats,
  onSelectIndicator,
}) => {
  const indicators = [
    {
      id: 'MISSING' as const,
      title: 'Missing Mandatory Documents',
      count: stats.missingDocumentsCount,
      desc: 'Applications with incomplete required checklist records',
      icon: FileQuestion,
      color: 'amber',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Immediate Action',
    },
    {
      id: 'DISCREPANCIES' as const,
      title: 'Unresolved Discrepancies',
      count: stats.unresolvedDiscrepanciesCount,
      desc: 'Identified intake ratios, space, or document mismatches',
      icon: AlertTriangle,
      color: 'rose',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'Deficiency Noted',
    },
    {
      id: 'REVIEW' as const,
      title: 'Applications Requiring Review',
      count: stats.applicationsRequiringReviewCount,
      desc: 'Submitted dossiers queued for scrutiny officer determination',
      icon: Eye,
      color: 'blue',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Review Queue',
    },
    {
      id: 'EXPIRED' as const,
      title: 'Expired Supporting Records',
      count: stats.expiredDocumentsCount,
      desc: 'NOCs or certificates whose validity has lapsed',
      icon: CalendarX,
      color: 'purple',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Lapsed Validity',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {indicators.map((ind) => {
        const Icon = ind.icon;
        return (
          <button
            key={ind.id}
            type="button"
            onClick={() => onSelectIndicator(ind.id)}
            className="p-3.5 rounded-xl border bg-white border-slate-200 text-left transition shadow-2xs hover:shadow-sm hover:border-slate-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${ind.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-slate-900">
                  {ind.count}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                {ind.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                {ind.desc}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] font-bold text-slate-600">
              <span className="uppercase tracking-wider">{ind.badge}</span>
              <span className="flex items-center text-[#2563EB] group-hover:underline">
                View List <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
