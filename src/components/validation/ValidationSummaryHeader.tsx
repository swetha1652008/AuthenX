import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import type { InstitutionApplication } from '../../types/institution';
import type { ManagedDocument } from '../../types/document';

interface ValidationSummaryHeaderProps {
  application: InstitutionApplication;
  documents: ManagedDocument[];
  onBackToPage4: () => void;
  onBackToPortal: () => void;
  onContinueToAnomalyDetection?: () => void;
}

export const ValidationSummaryHeader: React.FC<ValidationSummaryHeaderProps> = ({
  application,
  documents,
  onBackToPage4,
  onBackToPortal,
  onContinueToAnomalyDetection,
}) => {
  const processedCount = documents.filter((d) => d.ocrStatus === 'Completed').length;
  const withFindingsCount = documents.filter((d) => d.anomalies && d.anomalies.length > 0).length;
  const reviewRequiredCount = documents.filter(
    (d) => d.isExpired || (d.anomalies && d.anomalies.some((a) => a.severity === 'CRITICAL'))
  ).length;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Top Bar with Navigation, Title & Tagline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={onBackToPage4}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EAF2FF] text-[#102B4E] hover:text-[#2563EB] border border-slate-200 transition-colors cursor-pointer"
            title="Return to Statutory Document Vault"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#CFE2FE]">
                AI Inspection Engine
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Deterministic Verification Pipeline
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#102B4E] tracking-tight mt-1">
              AI Document Validation
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              <strong className="text-[#102B4E]">Trust Every Document. Verify Every Detail.</strong> — AICTE Approval Process Handbook (APH) automated compliance audit.
            </p>
          </div>
        </div>

        {/* Quick Return to Portal Link */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={onBackToPortal}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Institution Portal
          </button>
          <button
            type="button"
            onClick={onBackToPage4}
            className="px-3.5 py-2 rounded-xl bg-[#EAF2FF] hover:bg-[#CFE2FE] border border-[#CFE2FE] text-xs font-bold text-[#2563EB] transition-colors cursor-pointer"
          >
            Statutory Vault
          </button>
          {onContinueToAnomalyDetection && (
            <button
              type="button"
              onClick={onContinueToAnomalyDetection}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-xs font-bold text-teal-800 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
              <span>Anomaly Detection</span>
            </button>
          )}
        </div>
      </div>

      {/* Application & Validation KPI Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution</span>
            <span className="font-bold text-slate-900 truncate block" title={application.institution.name}>
              {application.institution.name}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reference ID</span>
            <span className="font-mono font-bold text-[#2563EB] truncate block">
              {application.referenceNumber}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Vault Documents</span>
            <span className="font-bold text-slate-900 text-sm">
              {documents.length} Files
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Processed OCR</span>
            <span className="font-bold text-emerald-700 text-sm">
              {processedCount} / {documents.length}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">With Findings</span>
            <span className="font-bold text-amber-700 text-sm">
              {withFindingsCount} Files
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Manual Review</span>
            <span className="font-bold text-rose-700 text-sm">
              {reviewRequiredCount} Files
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
