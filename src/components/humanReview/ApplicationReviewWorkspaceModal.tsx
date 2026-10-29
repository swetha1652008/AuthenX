import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  UserCheck, 
  History, 
  FileText, 
  GitCompare, 
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';
import type { 
  HumanReviewCase, 
  ReviewFindingItem 
} from '../../types/humanReview';

interface ApplicationReviewWorkspaceModalProps {
  caseItem: HumanReviewCase;
  onClose: () => void;
  onAddRemark: (remark: string, action: string) => void;
  onResolveFinding: (findingId: string, determination: string) => void;
  onReassignOfficer: (newOfficer: string) => void;
  onOpenRectificationModal: (finding?: ReviewFindingItem) => void;
  onTriggerRevalidation: () => void;
  onMarkCompleted: (remarks: string) => void;
}

export const ApplicationReviewWorkspaceModal: React.FC<ApplicationReviewWorkspaceModalProps> = ({
  caseItem,
  onClose,
  onAddRemark,
  onResolveFinding,
  onReassignOfficer,
  onOpenRectificationModal,
  onTriggerRevalidation,
  onMarkCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'FINDINGS' | 'EVIDENCE' | 'OFFICER_ACTIONS' | 'HISTORY'>('FINDINGS');
  
  // Action form states
  const [remarkText, setRemarkText] = useState('');
  const [resolvingFindingId, setResolvingFindingId] = useState<string | null>(null);
  const [determinationText, setDeterminationText] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(caseItem.assignedOfficer);
  const [completionRemarks, setCompletionRemarks] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const availableOfficers = [
    'Dr. Ramesh Sharma (Compliance Officer)',
    'Smt. Kavitha Nair (Verification Officer)',
    'Shri. Rajesh Verma (Senior Regional Officer)',
    'Prof. Ananya Sen (Approval Committee Member)'
  ];

  const handleResolveSubmit = (findingId: string) => {
    if (!determinationText.trim()) return;
    onResolveFinding(findingId, determinationText.trim());
    setResolvingFindingId(null);
    setDeterminationText('');
  };

  const handleAddRemarkSubmit = () => {
    if (!remarkText.trim()) return;
    onAddRemark(remarkText.trim(), 'OFFICER_REMARK_ADDED');
    setRemarkText('');
  };

  const handleReassignSubmit = () => {
    if (selectedOfficer === caseItem.assignedOfficer) return;
    onReassignOfficer(selectedOfficer);
  };

  const handleCompleteSubmit = () => {
    if (!completionRemarks.trim()) return;
    onMarkCompleted(completionRemarks.trim());
    setShowCompletionDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#102B4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Case Review Workspace: {caseItem.applicationId}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-400/20 text-blue-200 border border-blue-300/30">
                  {caseItem.applicationType}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white">
                  Case ID: {caseItem.id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-200 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{caseItem.institutionName}</span>
                <span>•</span>
                <span>{caseItem.region}</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">Assigned: {caseItem.assignedOfficer}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('FINDINGS')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'FINDINGS'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Flagged Findings ({caseItem.findings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EVIDENCE')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'EVIDENCE'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Evidence Comparison
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OFFICER_ACTIONS')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'OFFICER_ACTIONS'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Officer Actions & Decisions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            Audit & Remarks Log ({caseItem.remarksHistory.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: FLAGGED FINDINGS */}
          {activeTab === 'FINDINGS' && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">AI Validation Discrepancy Assessment:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    These issues were detected during automated statutory validation. Review each item against institution documentation and determine whether to accept, issue a rectification notice, or mark resolved with regulatory justification.
                  </p>
                </div>
              </div>

              {caseItem.findings.map((finding) => {
                const isResolved = finding.status === 'RESOLVED';

                return (
                  <div
                    key={finding.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isResolved
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          finding.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {finding.severity} SEVERITY
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{finding.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          AI Confidence: <strong className="text-slate-800">{finding.confidenceScore}%</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {finding.status}
                        </span>
                      </div>
                    </div>

                    {/* Rule Ref */}
                    {finding.ruleRef && (
                      <div className="text-[11px] text-slate-500 mb-2 font-medium">
                        Reference: <span className="text-[#102B4E]">{finding.ruleRef}</span>
                      </div>
                    )}

                    {/* AI Observation */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                      <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Observation:
                      </div>
                      <p className="text-slate-600 leading-relaxed">{finding.aiObservation}</p>
                    </div>

                    {/* Officer Determination */}
                    {finding.officerDetermination && (
                      <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-200 mb-3">
                        <div className="text-[11px] font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Officer Determination:
                        </div>
                        <p className="text-slate-700 leading-relaxed">{finding.officerDetermination}</p>
                      </div>
                    )}

                    {/* Inline Determination Form */}
                    {resolvingFindingId === finding.id ? (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 mt-2 space-y-2">
                        <label className="block text-[11px] font-bold text-emerald-900">
                          Regulatory Justification for Resolving Finding:
                        </label>
                        <textarea
                          rows={2}
                          value={determinationText}
                          onChange={(e) => setDeterminationText(e.target.value)}
                          placeholder="e.g. Verified genuine original certificate with State Revenue Registrar office..."
                          className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setResolvingFindingId(null)}
                            className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResolveSubmit(finding.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs shadow-sm"
                          >
                            Confirm Resolution
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Action Buttons */
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        {!isResolved && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenRectificationModal(finding)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" /> Request Rectification
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setResolvingFindingId(finding.id);
                                setDeterminationText('');
                              }}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Finding
                            </button>
                          </>
                        )}
                        {isResolved && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Resolved & Recorded in Audit Trail
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: EVIDENCE COMPARISON */}
          {activeTab === 'EVIDENCE' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700">
                <span className="font-bold text-slate-900">Side-by-Side Verification Evidence Review:</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Compare submitted institution evidence against statutory AICTE guidelines and automated extraction metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Institution Claim & Evidence */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="font-bold text-[#102B4E] text-xs">Submitted Institution Evidence</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Uploaded v1
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Evidence Title</span>
                      <div className="font-bold text-slate-800 text-xs">Computer Lab & Faculty Register</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Extracted Figures</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 mt-1">
                        <li>Declared Faculty: 16 full-time staff</li>
                        <li>Reported Lab Area: 66.4 sq.m</li>
                        <li>Fire NOC Validity: Registered on portal</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Digital Signature</span>
                      <div className="text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid e-Sign by Principal (Class 3 DSC)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: AICTE Mandated Norms */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="font-bold text-[#102B4E] text-xs">AICTE Mandated Benchmark Norms</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      APH 2026-27 Norms
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Applicable Clause</span>
                      <div className="font-bold text-slate-800 text-xs">Clause 4.1.2 & Clause 5.3</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Statutory Minimum Thresholds</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 mt-1">
                        <li>Required Faculty for 360 intake: 18 staff (Deficit: 2)</li>
                        <li>Required Computer Lab Carpet Area: 75 sq.m (Deficit: 8.6 sq.m)</li>
                        <li>NOC Domain: Verified state disaster portal</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Status Evaluation</span>
                      <div className="text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Rectification Notice Required for Deficits
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFICER ACTIONS & DECISIONS */}
          {activeTab === 'OFFICER_ACTIONS' && (
            <div className="space-y-6">
              {/* Add Remark Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h4 className="font-bold text-[#102B4E] text-xs mb-2">Record Official Review Remark</h4>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter detailed observations, verification outcomes, or compliance notes (these will be permanently recorded in the audit trail)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleAddRemarkSubmit}
                    disabled={!remarkText.trim()}
                    className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                  >
                    Save Remark to Audit Log
                  </button>
                </div>
              </div>

              {/* Reassign Officer */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-[#102B4E] text-xs">Reassign Review Case</h4>
                  <p className="text-[11px] text-slate-500">
                    Delegate this application to a regional scrutiny officer or specialized committee member.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    {availableOfficers.map((off) => (
                      <option key={off} value={off}>
                        {off}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleReassignSubmit}
                    disabled={selectedOfficer === caseItem.assignedOfficer}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-semibold rounded-xl text-xs"
                  >
                    Reassign
                  </button>
                </div>
              </div>

              {/* Major Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => onOpenRectificationModal()}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-amber-900 text-xs">Issue Rectification Notice</div>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    Send structured notice with 15-day deadline to institution.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={onTriggerRevalidation}
                  className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-300 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-indigo-900 text-xs">Trigger AI Re-validation</div>
                  <p className="text-[10px] text-indigo-700 mt-0.5">
                    Execute automated checks on newly submitted replacement files.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCompletionDialog(true)}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-emerald-900 text-xs">Complete & Sign Off Review</div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    Mark case finalized and transmit approval recommendation.
                  </p>
                </button>
              </div>

              {/* Completion Dialog */}
              {showCompletionDialog && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-700" /> Confirm Review Completion
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCompletionDialog(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    By completing this review, you certify that all statutory requirements have been verified according to the AICTE Approval Process Handbook.
                  </p>
                  <textarea
                    rows={2}
                    value={completionRemarks}
                    onChange={(e) => setCompletionRemarks(e.target.value)}
                    placeholder="Enter final sign-off remarks and committee recommendations..."
                    className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCompletionDialog(false)}
                      className="px-3 py-1.5 text-slate-600 text-xs hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteSubmit}
                      disabled={!completionRemarks.trim()}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-sm"
                    >
                      Sign Off Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT & REMARKS HISTORY */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 text-[11px]">
                <span className="font-bold text-slate-800">Immutable Case Audit Trail:</span> Every officer remark, re-assignment, rectification dispatch, and revalidation run is cryptographically chained and recorded below.
              </div>

              <div className="divide-y divide-slate-100">
                {caseItem.remarksHistory.map((rem) => (
                  <div key={rem.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">{rem.officerName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold">
                          {rem.officerRole}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {rem.actionTaken}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{rem.remark}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {rem.timestamp.replace('T', ' ').substring(0, 16)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
