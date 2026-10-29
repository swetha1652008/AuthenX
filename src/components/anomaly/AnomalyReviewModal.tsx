import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Info 
} from 'lucide-react';
import type { AnomalyAlert, AnomalyReviewStatus, AnomalySeverityLevel } from '../../types/anomaly';
import type { UserAccount } from '../../types/auth';

interface AnomalyReviewModalProps {
  alert: AnomalyAlert;
  currentUser: UserAccount | null;
  onClose: () => void;
  onSaveStatus: (alertId: string, status: AnomalyReviewStatus, notes: string) => void;
}

export const AnomalyReviewModal: React.FC<AnomalyReviewModalProps> = ({
  alert,
  currentUser,
  onClose,
  onSaveStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AnomalyReviewStatus>(alert.reviewStatus);
  const [notes, setNotes] = useState<string>(alert.reviewerNotes || '');

  const getSeverityBadge = (severity: AnomalySeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Critical</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Warning</span>
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            <span>Info</span>
          </span>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStatus(alert.id, selectedStatus, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="modal-alert-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  {alert.id}
                </span>
                {getSeverityBadge(alert.severity)}
              </div>
              <h2 id="modal-alert-title" className="text-base font-bold text-[#102B4E]">
                {alert.category} Review
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Statutory Legal Disclaimer Notice */}
          <div className="bg-amber-50/80 border border-amber-200 text-amber-900 p-3.5 rounded-xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Statutory Decision Support Disclaimer:</strong> This finding is produced by local algorithmic anomaly heuristics. Flagged discrepancies assist human verification officers and do not represent a legal confirmation of fraud, forgery, or an official AICTE determination.
            </p>
          </div>

          {/* Alert Subject & Rule Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Document
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate" title={alert.documentName}>{alert.documentName}</span>
              </div>
            </div>

            {alert.comparedDocumentName ? (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Compared Document
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800">
                  <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate" title={alert.comparedDocumentName}>{alert.comparedDocumentName}</span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Detection Rule
                </span>
                <span className="font-semibold text-slate-800 block mt-1">
                  {alert.detectionRule}
                </span>
              </div>
            )}
          </div>

          {/* AI Explanation & Evidence */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              AI Finding & Explanation
            </label>
            <p className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-700 leading-relaxed text-xs">
              {alert.explanation}
            </p>
          </div>

          {alert.supportingEvidence && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Extracted Evidence & Cryptographic Hash
              </label>
              <pre className="p-3 bg-slate-900 text-teal-300 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap leading-tight">
                {alert.supportingEvidence}
              </pre>
            </div>
          )}

          {/* Review Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Update Review Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                { status: 'PENDING' as AnomalyReviewStatus, label: 'Pending', icon: Clock, color: 'hover:border-amber-400 bg-amber-50/40' },
                { status: 'UNDER REVIEW' as AnomalyReviewStatus, label: 'Under Review', icon: Clock, color: 'hover:border-blue-400 bg-blue-50/40' },
                { status: 'CONFIRMED ISSUE' as AnomalyReviewStatus, label: 'Confirmed Issue', icon: XCircle, color: 'hover:border-red-400 bg-red-50/40 text-red-700' },
                { status: 'FALSE POSITIVE' as AnomalyReviewStatus, label: 'False Positive', icon: CheckCircle2, color: 'hover:border-emerald-400 bg-emerald-50/40 text-emerald-700' },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedStatus === opt.status;

                return (
                  <button
                    key={opt.status}
                    type="button"
                    onClick={() => setSelectedStatus(opt.status)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 text-xs font-bold ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/80 text-blue-800 ring-2 ring-blue-500/20' 
                        : `border-slate-200 text-slate-700 ${opt.color}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reviewer Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Reviewer Justification & Audit Notes</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {currentUser?.name ? `Logged as ${currentUser.name}` : 'Reviewer notes'}
              </span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter official observation, justification for clearing or escalating, or notes for committee review..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Save Decision</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
