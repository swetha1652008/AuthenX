import React from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  FileText, 
  Download, 
  Sparkles, 
  Building2, 
  Calendar, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface AnomalyHeaderProps {
  applicationId: string;
  institutionName: string;
  academicYear: string;
  userRole?: string;
  onNavigateToValidation: () => void;
  onNavigateToDocuments: () => void;
  onOpenReportModal: () => void;
  onExportJson: () => void;
}

export const AnomalyHeader: React.FC<AnomalyHeaderProps> = ({
  applicationId,
  institutionName,
  academicYear,
  userRole,
  onNavigateToValidation,
  onNavigateToDocuments,
  onOpenReportModal,
  onExportJson,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-xs">
      {/* Top Banner: Persistent DEMO MODE and Legal Disclaimer */}
      <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold uppercase px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md tracking-wider text-[10px]">
            DEMO MODE
          </span>
          <span className="font-medium text-slate-700">
            Automated anomaly & duplicate detection engine. Flagged findings are AI decision-support indicators and do not constitute legal proof of document forgery or official AICTE regulatory determination.
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>Local Deterministic Engine v2.4</span>
        </div>
      </div>

      {/* Main Title Row & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Forensic Security
                </span>
                <h1 className="text-xl font-extrabold text-[#102B4E] tracking-tight">
                  Document Authentication & Anomaly Detection
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographic hash verification, multi-document similarity analysis, date inconsistency detection, and metadata cross-checking
              </p>
            </div>
          </div>

          {/* Context Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              <span className="text-slate-400 font-normal">App ID:</span>
              <span className="font-mono text-[#102B4E]">{applicationId}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{institutionName}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{academicYear}</span>
            </span>

            {userRole && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Role: {userRole.replace(/_/g, ' ')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            type="button"
            onClick={onNavigateToValidation}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Return to AI Document Validation"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Validation</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToDocuments}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Return to Statutory Document Vault"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Document Vault</span>
          </button>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Anomaly Audit Report</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Findings (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
