import React from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';
import type { VerificationRequest, VerificationDashboardCounts } from '../../types/issuingAuthority';
import type { UserAccount } from '../../types/auth';

interface ExportReportModalProps {
  requests: VerificationRequest[];
  counts: VerificationDashboardCounts;
  currentUser: UserAccount | null;
  onClose: () => void;
  onDownloadCSV: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  requests,
  counts,
  currentUser,
  onClose,
  onDownloadCSV,
}) => {
  const [generationTimestamp] = React.useState(() => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#102B4E]">
                Export Issuing Authority Verification Report
              </h3>
              <p className="text-xs text-slate-500">
                Generate an official audit report and structured CSV dataset of all verified statutory certificates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Summary Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">
          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Requests</span>
              <strong className="text-xl font-black text-slate-900 mt-1 block">{counts.totalRequests}</strong>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Verified Authentic</span>
              <strong className="text-xl font-black text-emerald-700 mt-1 block">{counts.verifiedDocuments}</strong>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Mismatches</span>
              <strong className="text-xl font-black text-rose-700 mt-1 block">{counts.mismatchDetected}</strong>
            </div>
            <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-600 block">Manual Scrutiny</span>
              <strong className="text-xl font-black text-purple-700 mt-1 block">{counts.manualReviewRequired}</strong>
            </div>
          </div>

          {/* Certificate Type Summaries */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Summary by Certificate Type</span>
            <div className="divide-y divide-slate-100">
              {requests.slice(0, 5).map((r) => (
                <div key={r.id} className="py-2 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-800 truncate block">{r.certificateType}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{r.issuingAuthority}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.status === 'Verified' || r.status === 'Confirmed Against Official Evidence'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User & Security Audit Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Report Generated by: {currentUser?.name || 'Authorized Officer'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Role: {currentUser?.authorizedRole || 'User'} • Generated on: {generationTimestamp} IST
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Summary</span>
          </button>

          <button
            type="button"
            onClick={onDownloadCSV}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Formatted CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
