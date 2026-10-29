import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Download, 
  Edit3, 
  UserCheck,
  Calendar,
  Layers
} from 'lucide-react';
import type { 
  ManagedDocument, 
  ValidationReport, 
  ExtractedFieldItem 
} from '../../types/document';
import type { UserAccount } from '../../types/auth';

interface ValidationIntelligencePanelProps {
  document: ManagedDocument | null;
  report: ValidationReport | null;
  currentUser: UserAccount | null;
  onOpenReportModal: () => void;
  onDownloadReport: () => void;
  onOpenCorrectionModal: (field: ExtractedFieldItem) => void;
  onSelectFieldHighlight: (fieldKey: string) => void;
  onSubmitReviewDecision: (decision: 'Approved' | 'Rejected' | 'Rectification Requested', notes: string) => void;
}

export const ValidationIntelligencePanel: React.FC<ValidationIntelligencePanelProps> = ({
  document,
  report,
  currentUser,
  onOpenReportModal,
  onDownloadReport,
  onOpenCorrectionModal,
  onSelectFieldHighlight,
  onSubmitReviewDecision,
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'dates' | 'findings' | 'review'>('fields');
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Rejected' | 'Rectification Requested'>('Approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  if (!document || !report) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#CFE2FE] shadow-card flex flex-col items-center justify-center text-center h-full min-h-[450px]">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
          <Sparkles className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-slate-800">Intelligence Awaiting Input</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Select a document to view AI classification confidence, field completeness checks, and audit alerts.
        </p>
      </div>
    );
  }

  const handleDecisionSubmit = () => {
    setIsSubmittingDecision(true);
    onSubmitReviewDecision(reviewDecision, reviewNotes || `Reviewed by ${currentUser?.name || 'Authorized Officer'}`);
    setTimeout(() => {
      setIsSubmittingDecision(false);
      setReviewNotes('');
    }, 600);
  };

  const criticalFindings = report.alerts.filter((a) => a.severity === 'CRITICAL');
  const warningFindings = report.alerts.filter((a) => a.severity === 'WARNING');

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#CFE2FE] shadow-card flex flex-col h-full space-y-4">
      {/* Classification Card */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CFE2FE] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Category Classification</span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {Math.round(report.classificationResult.confidence * 100)}% Match
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-[#102B4E]">
              {report.classificationResult.category}
            </h4>
            <p className="text-[10px] text-slate-400">
              Method: {report.classificationResult.method}
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            OCR: {report.ocrStatus}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl text-[11px] font-bold text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('fields')}
          className={`py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'fields'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Fields ({report.extractedFields.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dates')}
          className={`py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'dates'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3 h-3" />
          <span>Dates ({report.dateFindings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('findings')}
          className={`py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 relative ${
            activeTab === 'findings'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span>Findings ({report.alerts.length})</span>
          {report.alerts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('review')}
          className={`py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'review'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>Decision</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] pr-1">
        {/* TAB 1: REQUIRED FIELDS */}
        {activeTab === 'fields' && (
          <div className="space-y-2">
            {report.extractedFields.map((field) => (
              <div
                key={field.id}
                onClick={() => onSelectFieldHighlight(field.fieldKey)}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#CFE2FE] text-left transition-all hover:shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {field.fieldName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-slate-400">
                      {Math.round(field.confidence * 100)}%
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        field.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : field.status === 'Needs Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {field.status}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCorrectionModal(field);
                      }}
                      className="p-1 text-slate-300 hover:text-[#2563EB] group-hover:text-slate-500 rounded"
                      title="Correct extracted value"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-800 break-words">
                  {field.extractedValue}
                </p>

                {field.evidenceSnippet && (
                  <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1">
                    "{field.evidenceSnippet}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DETERMINISTIC DATES */}
        {activeTab === 'dates' && (
          <div className="space-y-2.5">
            {report.dateFindings.map((df) => {
              const isExpired = df.status === 'Expired';
              const isWarning = df.status === 'Expiring Soon' || df.status === 'Date Uncertain';

              return (
                <div
                  key={df.fieldKey}
                  className={`p-3.5 rounded-2xl border text-left space-y-1.5 ${
                    isExpired
                      ? 'bg-rose-50/50 border-rose-200'
                      : isWarning
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-[#F8FAFC] border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{df.label}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isExpired
                          ? 'bg-rose-600 text-white'
                          : isWarning
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {df.status}
                    </span>
                  </div>

                  <p className="font-mono text-xs font-bold text-slate-900">
                    {df.parsedIsoDate || df.rawDateStr}
                  </p>

                  <p className="text-[11px] text-slate-600">{df.details}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: FINDINGS & ANOMALIES */}
        {activeTab === 'findings' && (
          <div className="space-y-2.5">
            {report.alerts.length > 0 ? (
              report.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl border text-left space-y-1.5 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          alert.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      />
                      {alert.type}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">{alert.explanation}</p>

                  {alert.supportingFieldOrText && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[10px] font-mono text-slate-600">
                      {alert.supportingFieldOrText}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>Status: <strong className="text-slate-600">{alert.reviewStatus}</strong></span>
                    <span>{alert.detectedAt}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h5 className="text-xs font-bold text-slate-800">Clean Document Audit</h5>
                <p className="text-[11px] text-slate-500">
                  No critical anomalies, duplicates, or format violations detected.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MANUAL REVIEW DECISION */}
        {activeTab === 'review' && (
          <div className="space-y-3 p-1 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Record Authorized Statutory Review Decision:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setReviewDecision('Approved')}
                  className={`p-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                    reviewDecision === 'Approved'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDecision('Rectification Requested')}
                  className={`p-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                    reviewDecision === 'Rectification Requested'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Rectify
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDecision('Rejected')}
                  className={`p-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                    reviewDecision === 'Rejected'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Reviewer Observations & Statutory Notes:
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter regulatory verification notes or deficiency details..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 text-slate-800"
              />
            </div>

            <button
              type="button"
              onClick={handleDecisionSubmit}
              disabled={isSubmittingDecision}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmittingDecision ? 'Recording Decision...' : 'Save Decision & Log Audit'}</span>
            </button>

            {report.reviewedBy && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500">
                <span>Last Decision: <strong className="text-slate-800">{report.manualReviewDecision}</strong></span>
                <span className="block mt-0.5">By: {report.reviewedBy} on {report.reviewedAt}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Report Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenReportModal}
          className="flex-1 px-3 py-2 rounded-xl border border-[#CFE2FE] bg-white hover:bg-[#EAF2FF] text-[#2563EB] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Report</span>
        </button>

        <button
          type="button"
          onClick={onDownloadReport}
          className="px-3 py-2 rounded-xl bg-[#102B4E] hover:bg-[#2563EB] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          title="Download JSON audit report"
        >
          <Download className="w-3.5 h-3.5" />
          <span>JSON</span>
        </button>
      </div>

      {/* Finding Status Summary Banner */}
      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[10px] flex items-center justify-between text-slate-500">
        <span>Deficiencies: <strong className="text-rose-600">{criticalFindings.length} Critical</strong>, <strong className="text-amber-600">{warningFindings.length} Warning</strong></span>
        <span className="font-semibold text-slate-700">{report.rulesetVersion}</span>
      </div>
    </div>
  );
};
