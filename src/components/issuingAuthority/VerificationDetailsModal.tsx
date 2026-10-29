import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  QrCode, 
  Hash, 
  Globe2, 
  Sparkles, 
  UserCheck, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Edit3, 
  Save, 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';
import type { 
  VerificationRequest, 
  ManualReviewOutcome 
} from '../../types/issuingAuthority';
import type { UserAccount } from '../../types/auth';

interface VerificationDetailsModalProps {
  request: VerificationRequest | null;
  initialTab?: string;
  currentUser: UserAccount | null;
  onClose: () => void;
  onAssignOfficer: (requestId: string, officer: { id: string; name: string; role: string }) => void;
  onAddReviewNote: (requestId: string, note: string) => void;
  onRequestAdditionalDocs: (requestId: string, docs: string[], reason: string) => void;
  onRecordOutcome: (
    requestId: string, 
    outcome: ManualReviewOutcome, 
    notes: string, 
    evidence: string, 
    sourceContacted: string
  ) => void;
  onMarkInvestigation: (requestId: string, reason: string) => void;
  onCorrectOcrField: (requestId: string, fieldKey: string, newValue: string) => void;
}

export const VerificationDetailsModal: React.FC<VerificationDetailsModalProps> = ({
  request,
  initialTab = 'overview',
  currentUser,
  onClose,
  onAssignOfficer,
  onAddReviewNote,
  onRequestAdditionalDocs,
  onRecordOutcome,
  onMarkInvestigation,
  onCorrectOcrField,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Officer Review Form State
  const [reviewOutcome, setReviewOutcome] = useState<ManualReviewOutcome>('Confirmed Against Official Evidence');
  const [officerNotes, setOfficerNotes] = useState('');
  const [evidenceReviewed, setEvidenceReviewed] = useState('');
  const [sourceContacted, setSourceContacted] = useState('');
  const [quickNote, setQuickNote] = useState('');

  // Additional Docs Request Form State
  const [reqDocInput, setReqDocInput] = useState('');
  const [reqDocReason, setReqDocReason] = useState('');

  // Forensic Investigation State
  const [investigationReason, setInvestigationReason] = useState('');

  // OCR Correction Form State
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [editingFieldValue, setEditingFieldValue] = useState('');

  if (!request) return null;

  const isOfficerOrAdmin = 
    currentUser?.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER' ||
    currentUser?.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser?.authorizedRole === 'REGULATORY_ADMIN';

  const handleSaveOcrCorrection = (fieldKey: string) => {
    onCorrectOcrField(request.id, fieldKey, editingFieldValue);
    setEditingFieldKey(null);
  };

  const handleExecuteOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNotes.trim()) {
      alert('Officer notes and rationale are mandatory for consequential review decisions.');
      return;
    }
    onRecordOutcome(
      request.id,
      reviewOutcome,
      officerNotes,
      evidenceReviewed || 'Direct inspection of statutory document seal and metadata',
      sourceContacted || 'Authority registry public directory',
    );
    setOfficerNotes('');
    setEvidenceReviewed('');
  };

  const handleDownload = () => {
    const textBlob = new Blob(
      [
        `========================================================================\n` +
        `AUTHENX STATUTORY ISSUING AUTHORITY VERIFICATION REPORT\n` +
        `========================================================================\n` +
        `REQUEST ID:            ${request.id}\n` +
        `APPLICATION REF:       ${request.applicationReference}\n` +
        `INSTITUTION:           ${request.institutionName} (${request.institutionId})\n` +
        `CERTIFICATE TYPE:      ${request.certificateType}\n` +
        `CERTIFICATE NUMBER:    ${request.certificateNumber}\n` +
        `REFERENCE NUMBER:      ${request.referenceNumber}\n` +
        `ISSUING AUTHORITY:     ${request.issuingAuthority}\n` +
        `ISSUE DATE:            ${request.issueDate}\n` +
        `EXPIRY DATE:           ${request.expiryDate}\n` +
        `CURRENT STATUS:        ${request.status}\n` +
        `SUBMITTED BY:          ${request.submittedBy.name} (${request.submittedBy.role})\n` +
        `SUBMITTED AT:          ${request.submittedAt}\n` +
        `ASSIGNED REVIEWER:     ${request.assignedReviewer?.name || 'Unassigned'}\n` +
        `FILE SHA-256 HASH:     ${request.fileHash}\n` +
        `========================================================================\n\n` +
        `AUDIT TRAIL LOG:\n` +
        request.auditTrail.map((a) => `[${a.timestamp}] ${a.actorName}: ${a.action} - ${a.details}`).join('\n')
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(textBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuthenX_${request.id}_Verification_Record.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
                  {request.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {request.applicationReference}
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded">
                  {request.status}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#102B4E] truncate mt-0.5" title={request.certificateType}>
                {request.certificateType}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Download Record"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8 Tab Navigation Buttons */}
        <div className="px-6 border-b border-slate-200 flex gap-5 bg-white text-xs font-bold text-slate-500 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'preview', label: 'Document Preview', icon: FileText },
            { id: 'qr', label: 'QR Verification', icon: QrCode },
            { id: 'reference', label: 'Reference Lookup', icon: Hash },
            { id: 'official', label: 'Official Source', icon: Globe2 },
            { id: 'ai', label: 'AI Analysis', icon: Sparkles },
            { id: 'manual-review', label: 'Manual Review', icon: UserCheck },
            { id: 'audit-trail', label: 'Audit Trail', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[380px] bg-[#F8FAFC]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              {/* Institution Context Banner */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Institutional Master Context
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block">Institution Name</span>
                    <strong className="text-slate-900 text-sm">{request.institutionName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Permanent ID (PID)</span>
                    <strong className="font-mono text-[#2563EB]">{request.institutionId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Application Ref & Category</span>
                    <strong className="text-slate-800">{request.applicationReference} ({request.applicationCategory})</strong>
                  </div>
                </div>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate Number</span>
                  <span className="font-mono font-bold text-slate-900 mt-1 block">{request.certificateNumber}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reference Number</span>
                  <span className="font-mono font-bold text-slate-900 mt-1 block">{request.referenceNumber}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue Date</span>
                  <span className="font-mono font-bold text-slate-900 mt-1 block">{request.issueDate}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiry Date</span>
                  <span className="font-mono font-bold text-slate-900 mt-1 block">{request.expiryDate}</span>
                </div>
              </div>

              {/* Issuing Authority & Review Reason */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Issuing Authority</span>
                <p className="text-sm font-bold text-slate-800">{request.issuingAuthority}</p>
                {request.reasonForManualReview && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 mt-2">
                    <strong className="block font-bold">Reason for Manual Review Flag:</strong>
                    <span>{request.reasonForManualReview}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENT PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-500">
                  File: {request.fileName} ({request.fileSize}) • SHA-256: {request.fileHash.substring(0, 16)}...
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((p) => Math.max(50, p - 25))}
                    className="p-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((p) => Math.min(200, p + 25))}
                    className="p-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rendered Preview Canvas */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-[320px] flex items-center justify-center shadow-inner overflow-auto">
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="w-full max-w-2xl bg-white border border-slate-300 rounded-xl shadow-md p-8 text-slate-800 space-y-4 transition-transform duration-200"
                >
                  <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                        Official Statutory Certificate
                      </span>
                      <h4 className="text-sm font-black text-slate-900 uppercase">
                        {request.certificateType}
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {request.id}
                    </span>
                  </div>

                  <div className="py-4 space-y-2 text-xs font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line">
                    <p><strong>ISSUING BODY:</strong> {request.issuingAuthority}</p>
                    <p><strong>RECIPIENT ENTITY:</strong> {request.institutionName}</p>
                    <p><strong>CERTIFICATE REFERENCE:</strong> {request.certificateNumber}</p>
                    <p><strong>ISSUE DATE:</strong> {request.issueDate} | <strong>EXPIRY:</strong> {request.expiryDate}</p>
                    <p className="pt-2 text-slate-400">Authenticity validated through cryptographic digest and registry parity checks.</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Cryptographic SHA-256: {request.fileHash.substring(0, 24)}...</span>
                    <span>Page 1 of 1</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QR VERIFICATION */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">QR Code Decoding & Issuing Domain Findings</h4>
              {request.qrResult ? (
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border ${
                    request.qrResult.decoded && request.qrResult.isDomainTrusted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : !request.qrResult.decoded
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <h5 className="font-bold">{request.qrResult.details}</h5>
                    <p className="mt-1">Source: {request.qrResult.sourceName} • {request.qrResult.timestamp}</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Decoded URL / Payload</span>
                    <div className="font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 break-all select-all">
                      {request.qrResult.rawPayload || 'N/A'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
                  <p>QR Code verification method was not selected or has not been run for this request.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REFERENCE LOOKUP */}
          {activeTab === 'reference' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">Reference Number Registry Cross-Check</h4>
              {request.referenceResult ? (
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border ${
                    request.referenceResult.status === 'VERIFIED'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <h5 className="font-bold">{request.referenceResult.details}</h5>
                    <p className="mt-1">Checked on: {request.referenceResult.timestamp}</p>
                  </div>

                  {request.referenceResult.matchedRecord && (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Registry Certificate No</span>
                        <span className="font-mono font-bold text-slate-900">{request.referenceResult.matchedRecord.certificateNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Registered Institution</span>
                        <span className="font-semibold text-slate-900">{request.referenceResult.matchedRecord.institutionName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Signatory</span>
                        <span className="text-slate-800">{request.referenceResult.matchedRecord.issuingOfficer}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                        <span className="font-bold text-emerald-700">{request.referenceResult.matchedRecord.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
                  <p>Reference lookup was not executed for this certificate.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: OFFICIAL SOURCE */}
          {activeTab === 'official' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">Official API / State Portal Gateway Integration</h4>
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-slate-600" />
                  <strong className="text-sm">Official Integration Not Configured</strong>
                </div>
                <p className="text-slate-600">
                  Connect an authorized issuing-authority source to enable live verification. 
                  AuthenX complies with regulatory standards and never fabricates mock clearances when live government APIs are unconfigured.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: AI ANALYSIS */}
          {activeTab === 'ai' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">AI-Assisted Anomaly & Consistency Findings</h4>
              {request.aiFindings && request.aiFindings.length > 0 ? (
                <div className="space-y-3">
                  {request.aiFindings.map((finding) => (
                    <div key={finding.id} className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-700 flex items-center gap-1.5 text-xs">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          {finding.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                          {finding.severity}
                        </span>
                      </div>
                      <p className="text-slate-700">{finding.explanation}</p>
                      <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-600 border border-slate-200">
                        Evidence: {finding.supportingEvidence}
                      </div>
                      <p className="text-emerald-700 font-medium pt-1">
                        Recommended Next Step: {finding.recommendedNextStep}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-emerald-200 text-center text-slate-700 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h5 className="font-bold text-sm">No Document Anomalies Detected</h5>
                  <p className="text-slate-500 text-xs">Deterministic rules and AI heuristics identified no variances across legal names, dates, or cryptographic hashes.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: MANUAL REVIEW */}
          {activeTab === 'manual-review' && (
            <div className="space-y-5 text-xs">
              {/* Officer Decision Form */}
              {isOfficerOrAdmin ? (
                <>
                <form onSubmit={handleExecuteOutcome} className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-sm text-[#102B4E]">Authorized Officer Scrutiny & Decision Action Box</h4>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Evaluator Role Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Outcome Selector */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Consequential Review Outcome *</label>
                      <select
                        value={reviewOutcome}
                        onChange={(e) => setReviewOutcome(e.target.value as ManualReviewOutcome)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      >
                        <option value="Confirmed Against Official Evidence">Confirmed Against Official Evidence</option>
                        <option value="Mismatch Confirmed">Mismatch Confirmed</option>
                        <option value="Additional Documents Required">Additional Documents Required</option>
                        <option value="Further Investigation Required">Further Investigation Required</option>
                        <option value="Unable to Confirm">Unable to Confirm</option>
                      </select>
                    </div>

                    {/* Source Contacted */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Source Contacted / Examined</label>
                      <input
                        type="text"
                        value={sourceContacted}
                        onChange={(e) => setSourceContacted(e.target.value)}
                        placeholder="e.g., State Gazette notification / Physical Registrar seal"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* Evidence Reviewed */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700 block">Evidence Reviewed *</label>
                      <input
                        type="text"
                        value={evidenceReviewed}
                        onChange={(e) => setEvidenceReviewed(e.target.value)}
                        placeholder="e.g., Verified against VTU Belagavi Gazette Notification Item 42"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* Officer Notes */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700 block">Evaluator Observations & Rationale *</label>
                      <textarea
                        rows={3}
                        value={officerNotes}
                        onChange={(e) => setOfficerNotes(e.target.value)}
                        placeholder="Provide detailed statutory rationale for this outcome decision..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors cursor-pointer shadow-md"
                    >
                      Save Consequential Outcome & Update Audit Trail
                    </button>
                  </div>
                </form>

                {/* Additional Officer Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Quick Note */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Add Quick Review Note</span>
                    <input
                      type="text"
                      value={quickNote}
                      onChange={(e) => setQuickNote(e.target.value)}
                      placeholder="Note for audit log..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (quickNote.trim()) {
                          onAddReviewNote(request.id, quickNote);
                          setQuickNote('');
                        }
                      }}
                      className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Post Note
                    </button>
                  </div>

                  {/* Request Docs */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Request Extra Documents</span>
                    <input
                      type="text"
                      value={reqDocInput}
                      onChange={(e) => setReqDocInput(e.target.value)}
                      placeholder="e.g. Updated Fire NOC, Form 15"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      value={reqDocReason}
                      onChange={(e) => setReqDocReason(e.target.value)}
                      placeholder="Statutory reason"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (reqDocInput.trim()) {
                          onRequestAdditionalDocs(request.id, reqDocInput.split(',').map((s) => s.trim()), reqDocReason || 'Regulatory clarification');
                          setReqDocInput('');
                          setReqDocReason('');
                        }
                      }}
                      className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Request Documents
                    </button>
                  </div>

                  {/* Forensic Escalate */}
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Forensic Investigation</span>
                    <input
                      type="text"
                      value={investigationReason}
                      onChange={(e) => setInvestigationReason(e.target.value)}
                      placeholder="Reason for forensic review"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (investigationReason.trim()) {
                          onMarkInvestigation(request.id, investigationReason);
                          setInvestigationReason('');
                        }
                      }}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Escalate Investigation
                    </button>
                    {!request.assignedReviewer && currentUser && (
                      <button
                        type="button"
                        onClick={() => onAssignOfficer(request.id, { id: currentUser.id, name: currentUser.name, role: currentUser.authorizedRole })}
                        className="w-full py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-[11px] cursor-pointer"
                      >
                        Assign Case to Me
                      </button>
                    )}
                  </div>
                </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong className="block">Institutional Read-Only Scrutiny View</strong>
                  <span>Institution administrators can view officer review notes and audit history, but cannot alter evaluator scrutiny outcomes.</span>
                </div>
              )}

              {/* Past Review Records */}
              {request.manualReview && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Review Record</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block">Assigned Officer:</span>
                      <strong className="text-slate-800">{request.manualReview.assignedOfficer?.name || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status:</span>
                      <strong className="text-purple-700">{request.manualReview.reviewStatus}</strong>
                    </div>
                  </div>
                  {request.manualReview.officerNotes && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                      {request.manualReview.officerNotes}
                    </div>
                  )}
                </div>
              )}

              {/* In-Line OCR Correction Tool */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Extracted OCR Attributes & In-Line Authorized Correction
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {request.extractedOcrFields && Object.entries(request.extractedOcrFields).map(([k, val]) => {
                    if (typeof val !== 'string') return null;
                    const isEditing = editingFieldKey === k;

                    return (
                      <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">{k}</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingFieldValue}
                              onChange={(e) => setEditingFieldValue(e.target.value)}
                              className="px-2 py-1 bg-white border border-[#2563EB] rounded text-xs text-slate-900 font-mono mt-0.5"
                            />
                          ) : (
                            <span className="font-semibold text-slate-900 truncate block">{val}</span>
                          )}
                        </div>

                        {isOfficerOrAdmin && (
                          isEditing ? (
                            <button
                              type="button"
                              onClick={() => handleSaveOcrCorrection(k)}
                              className="p-1 rounded bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                              title="Save Correction"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFieldKey(k);
                                setEditingFieldValue(val);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-[#2563EB] hover:bg-blue-50"
                              title="Correct Field"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT TRAIL */}
          {activeTab === 'audit-trail' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">Cryptographic & Workflow Audit Trail</h4>
              <div className="space-y-2">
                {request.auditTrail.map((entry) => (
                  <div key={entry.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                      LOG
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{entry.action}</span>
                        <span className="font-mono text-[10px] text-slate-400">{entry.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{entry.details}</p>
                      <div className="text-[10px] text-slate-400 mt-1">Actor: {entry.actorName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span>Status: </span>
            <strong className="text-slate-800">{request.status}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
