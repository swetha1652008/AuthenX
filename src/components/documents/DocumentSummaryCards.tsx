import React from 'react';
import { 
  Files, 
  UploadCloud, 
  FileWarning, 
  Clock, 
  ShieldAlert, 
  AlertTriangle 
} from 'lucide-react';
import type { DocumentDashboardCounts } from '../../types/document';

interface DocumentSummaryCardsProps {
  counts: DocumentDashboardCounts;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const DocumentSummaryCards: React.FC<DocumentSummaryCardsProps> = ({
  counts,
  selectedFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Required',
      count: counts.totalRequired,
      subtitle: 'Mandatory AICTE Norms',
      icon: Files,
      color: 'blue',
      borderClass: 'border-blue-200',
      bgClass: 'bg-blue-50/50',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'UPLOADED',
      title: 'Uploaded Docs',
      count: counts.uploadedDocuments,
      subtitle: 'In Application Vault',
      icon: UploadCloud,
      color: 'teal',
      borderClass: 'border-teal-200',
      bgClass: 'bg-teal-50/50',
      iconBg: 'bg-teal-100 text-teal-600',
    },
    {
      id: 'MISSING',
      title: 'Missing Docs',
      count: counts.missingDocuments,
      subtitle: 'Mandatory Gaps',
      icon: FileWarning,
      color: counts.missingDocuments > 0 ? 'rose' : 'slate',
      borderClass: counts.missingDocuments > 0 ? 'border-rose-200' : 'border-slate-200',
      bgClass: counts.missingDocuments > 0 ? 'bg-rose-50/50' : 'bg-slate-50/50',
      iconBg: counts.missingDocuments > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500',
    },
    {
      id: 'EXPIRED',
      title: 'Expired Docs',
      count: counts.expiredDocuments,
      subtitle: 'Out of Validity',
      icon: Clock,
      color: counts.expiredDocuments > 0 ? 'amber' : 'slate',
      borderClass: counts.expiredDocuments > 0 ? 'border-amber-200' : 'border-slate-200',
      bgClass: counts.expiredDocuments > 0 ? 'bg-amber-50/50' : 'bg-slate-50/50',
      iconBg: counts.expiredDocuments > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500',
    },
    {
      id: 'PENDING',
      title: 'Pending Verification',
      count: counts.pendingVerification,
      subtitle: 'Awaiting Auth Check',
      icon: ShieldAlert,
      color: 'indigo',
      borderClass: 'border-indigo-200',
      bgClass: 'bg-indigo-50/50',
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'ATTENTION',
      title: 'Requires Attention',
      count: counts.requiringAttention,
      subtitle: 'Anomalies & Deficiencies',
      icon: AlertTriangle,
      color: counts.requiringAttention > 0 ? 'rose' : 'slate',
      borderClass: counts.requiringAttention > 0 ? 'border-rose-300' : 'border-slate-200',
      bgClass: counts.requiringAttention > 0 ? 'bg-rose-50' : 'bg-slate-50',
      iconBg: counts.requiringAttention > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
              card.borderClass
            } ${card.bgClass} ${
              isSelected
                ? 'ring-2 ring-[#2563EB] shadow-md -translate-y-0.5'
                : 'hover:shadow-sm hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 truncate">{card.title}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#102B4E] tracking-tight">{card.count}</div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{card.subtitle}</p>

            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563EB]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
