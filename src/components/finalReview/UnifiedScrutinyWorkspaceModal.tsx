import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  FileCheck2, 
  CheckSquare, 
  ShieldAlert, 
  ClipboardList, 
  Send, 
  Gavel, 
  Calendar, 
  CheckCircle2, 
  Info, 
  Plus
} from 'lucide-react';
import type { 
  CrossModuleDiscrepancy, 
  OfficerObservationItem, 
  ClarificationEvidenceRequest, 
  AuthorizedDecisionRecord,
  AuthorizedDecisionOutcome 
} from '../../types/finalReview';
import type { InstitutionApplication } from '../../types/institution';
import type { ComplianceAssessment } from '../../types/compliance';
import type { UserRoleId } from '../../types/auth';

interface Props {
  app: InstitutionApplication;
  assessment?: ComplianceAssessment;
  discrepancies: CrossModuleDiscrepancy[];
  observations: OfficerObservationItem[];
  evidenceRequests: ClarificationEvidenceRequest[];
  decisionRecord?: AuthorizedDecisionRecord;
  currentUserRole?: UserRoleId;
  onClose: () => void;
  onSaveObservation: (data: Partial<OfficerObservationItem>) => void;
  onResolveDiscrepancy: (id: string, notes: string) => void;
  onSendClarification: (data: Partial<ClarificationEvidenceRequest>) => void;
  onRecordDecision: (outcome: AuthorizedDecisionOutcome, remarks: string) => void;
}

export const UnifiedScrutinyWorkspaceModal: React.FC<Props> = ({
  app,
  assessment,
  discrepancies,
  observations,
  evidenceRequests,
  decisionRecord,
  currentUserRole,
  onClose,
  onSaveObservation,
  onResolveDiscrepancy,
  onSendClarification,
  onRecordDecision,
}) => {
  const [activeTab, setActiveTab] = useState<
    'DOSSIER' | 'DOCUMENTS' | 'COMPLIANCE' | 'DISCREPANCIES' | 'OBSERVATIONS' | 'DECISION'
  >('DOSSIER');

  // Form states
  const [newObsCategory, setNewObsCategory] = useState<OfficerObservationItem['category']>('DOCUMENTATION');
  const [newObsField, setNewObsField] = useState('');
  const [newObsSeverity, setNewObsSeverity] = useState<OfficerObservationItem['severity']>('OBSERVATION');
  const [newObsNotes, setNewObsNotes] = useState('');

  const [clarTarget, setClarTarget] = useState('');
  const [clarInfo, setClarInfo] = useState('');
  const [clarJustification, setClarJustification] = useState('');
  const [clarDueDate, setClarDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [showClarForm, setShowClarForm] = useState(false);

  const [decisionOutcome, setDecisionOutcome] = useState<AuthorizedDecisionOutcome>('READY_FOR_COMPETENT_AUTHORITY_REVIEW');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [decisionConfirmed, setDecisionConfirmed] = useState(false);

  // Stages 1 to 9
  const timelineStages = [
    { num: 1, title: 'Application Submission', desc: 'Initial EoA / Change application submitted by campus', done: true },
    { num: 2, title: 'AI Pre-Validation', desc: 'Automated OCR extraction & preliminary document scan', done: true },
    { num: 3, title: 'Document Authentication', desc: 'Hash verification & digital signature validation', done: true },
    { num: 4, title: 'Issuing Authority Verification', desc: 'Bhoomi/BBMP/VTU registry cross-checking', done: true },
    { num: 5, title: 'Regulatory Checklist Check', desc: 'APH 2026-27 rules engine evaluation', done: true },
    { num: 6, title: 'Infrastructure Evidence Review', desc: 'Carpet area blueprints & laboratory photo review', done: true },
    { num: 7, title: 'Officer Scrutiny & Findings', desc: 'Regional scrutiny committee detailed case evaluation', done: true },
    { num: 8, title: 'Clarification / Inspection', desc: 'Rectification documentation & physical inspection review', done: evidenceRequests.length > 0 },
    { num: 9, title: 'Authorized Decision Record', desc: 'Official internal scrutiny determination', done: Boolean(decisionRecord) },
  ];

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsField.trim() || !newObsNotes.trim()) return;
    onSaveObservation({
      applicationId: app.id,
      category: newObsCategory,
      requirementOrField: newObsField,
      severity: newObsSeverity,
      officerNotes: newObsNotes,
    });
    setNewObsField('');
    setNewObsNotes('');
  };

  const handleCreateClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarTarget.trim() || !clarInfo.trim()) return;
    onSendClarification({
      applicationId: app.id,
      targetFindingOrItem: clarTarget,
      requestedInfo: clarInfo,
      justification: clarJustification,
      dueDate: clarDueDate,
    });
    setClarTarget('');
    setClarInfo('');
    setClarJustification('');
    setShowClarForm(false);
  };

  const handleRecordOfficialDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionRemarks.trim() || !decisionConfirmed) {
      alert('Please enter statutory remarks and check the confirmation box.');
      return;
    }
    onRecordDecision(decisionOutcome, decisionRemarks);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-scale-in max-h-[94vh] flex flex-col">
        {/* Workspace Top Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-[#102B4E] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563EB] rounded-xl text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-200">{app.id}</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#2563EB] text-white">
                  {app.type}
                </span>
                <span className="text-[10px] text-slate-300">AY {app.academicYear}</span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {app.institution?.name || 'Technical Institution'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold gap-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('DOSSIER')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
              activeTab === 'DOSSIER'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Campus Dossier & Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
              activeTab === 'DOCUMENTS'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" /> Multi-Source Documents ({app.documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
              activeTab === 'COMPLIANCE'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Regulatory & Infrastructure Norms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DISCREPANCIES')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
              activeTab === 'DISCREPANCIES'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Cross-Module Discrepancies ({discrepancies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('OBSERVATIONS')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
              activeTab === 'OBSERVATIONS'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Scrutiny Observations ({observations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DECISION')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors shrink-0 ${
              activeTab === 'DECISION'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gavel className="w-4 h-4" /> Authorized Decision Panel
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* TAB 1: DOSSIER & 9-STAGE TIMELINE */}
          {activeTab === 'DOSSIER' && (
            <div className="space-y-6">
              {/* Institution Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Permanent AICTE ID</span>
                  <div className="font-mono font-bold text-slate-800 text-sm">{app.institutionId}</div>
                  <div className="text-[11px] text-slate-500 mt-1">AISHE: {app.institution?.aisheCode || 'C-14298'}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">State & Jurisdiction</span>
                  <div className="font-semibold text-slate-800">{app.institution?.state || 'Karnataka'}, {app.institution?.district || 'Bengaluru Urban'}</div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{app.institution?.fullAddress}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Authorized Representative</span>
                  <div className="font-semibold text-slate-800">{app.institution?.authorizedRepresentative || 'Dr. Arunachalam M.'}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{app.institution?.officialEmail || 'principal@apextech.edu'}</div>
                </div>
              </div>

              {/* 9-Stage Regulatory Scrutiny Timeline */}
              <div>
                <h4 className="text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  9-Stage Statutory Scrutiny Progression Workflow
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {timelineStages.map((stg) => (
                    <div
                      key={stg.num}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        stg.done
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                        stg.done ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}>
                        {stg.done ? '✓' : stg.num}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{stg.title}</div>
                        <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{stg.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSOLIDATED DOCUMENT VERIFICATION */}
          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-900 text-xs">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Consolidating multi-source verification records from Issuing Authority Verification, QR decoders, and digital signatures.
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {app.documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-[#102B4E] text-xs">{doc.name}</div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>Category: <strong>{doc.category}</strong></span>
                        <span>Size: {doc.fileSize}</span>
                        <span>Uploaded: {doc.uploadDate}</span>
                        {doc.verificationSource && (
                          <span className="text-[#0F766E] font-semibold">
                            Source: {doc.verificationSource}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REGULATORY & INFRASTRUCTURE COMPLIANCE */}
          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs">
                Consolidated assessment items evaluated by the APH 2026-27 rules engine and officer physical checks.
              </div>

              {assessment && assessment.items.length > 0 ? (
                <div className="space-y-3">
                  {assessment.items.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {item.requirementCode}
                          </span>
                          <span className="font-bold text-slate-800 text-xs">{item.ruleTitle}</span>
                          {item.mandatory && (
                            <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-rose-50 text-rose-600 border border-rose-200">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{item.reviewerNotes || 'Mandatory compliance parameter'}</p>
                        <div className="text-[10px] text-slate-400">
                          Regulatory Source: <span className="font-medium text-slate-600">{item.regulatorySource}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.officerResult === 'APPROVED' || item.evidenceStatus === 'SUBMITTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.officerResult !== 'UNASSESSED' ? item.officerResult : item.evidenceStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No checklist items recorded.</p>
              )}
            </div>
          )}

          {/* TAB 4: CROSS-MODULE DISCREPANCIES */}
          {activeTab === 'DISCREPANCIES' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
                Discrepancies identified when comparing application fields with municipal blueprints, state ledgers, or faculty payrolls.
              </div>

              {discrepancies.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">0 Cross-Module Discrepancies Detected</p>
                  <p className="text-[11px] text-slate-400">All submitted blueprints and statutory registries match perfectly.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {discrepancies.map((d) => (
                    <div
                      key={d.id}
                      className={`p-4 rounded-xl border ${
                        d.status === 'RESOLVED'
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-rose-200 bg-rose-50/20'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#102B4E]">{d.fieldName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            d.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {d.severity}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {d.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700">{d.explanation}</p>

                      <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px]">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Source 1: {d.source1}</span>
                          <span className="font-semibold text-slate-800">{d.source1Value}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Source 2: {d.source2}</span>
                          <span className="font-semibold text-slate-800">{d.source2Value}</span>
                        </div>
                      </div>

                      {d.status === 'OPEN' && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => onResolveDiscrepancy(d.id, 'Verified and endorsed after committee scrutiny.')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Mark Discrepancy Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: OBSERVATIONS & CLARIFICATIONS */}
          {activeTab === 'OBSERVATIONS' && (
            <div className="space-y-6">
              {/* Evidence Requests Pending */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-[#102B4E] uppercase tracking-wider">
                    Statutory Clarification & Additional Evidence Requests ({evidenceRequests.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowClarForm(!showClarForm)}
                    className="px-3 py-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Transmit Evidence Request
                  </button>
                </div>

                {showClarForm && (
                  <form onSubmit={handleCreateClarification} className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3 mb-4">
                    <h5 className="font-bold text-xs text-[#102B4E]">Formulate Additional Evidence Notice</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Finding</label>
                        <input
                          type="text"
                          required
                          value={clarTarget}
                          onChange={(e) => setClarTarget(e.target.value)}
                          placeholder="e.g. REG-2026-FAC-03 Faculty Ratio"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Due Date</label>
                        <input
                          type="date"
                          value={clarDueDate}
                          onChange={(e) => setClarDueDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Requested Certified Document</label>
                      <input
                        type="text"
                        required
                        value={clarInfo}
                        onChange={(e) => setClarInfo(e.target.value)}
                        placeholder="e.g. Appointment orders and joining reports for 3 faculty members"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Statutory Justification</label>
                      <input
                        type="text"
                        value={clarJustification}
                        onChange={(e) => setClarJustification(e.target.value)}
                        placeholder="e.g. APH 2026-27 Table 2.1 Cadre Norm Requirement"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowClarForm(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#2563EB] text-white rounded-lg font-bold flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Dispatch Notice
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {evidenceRequests.map((req) => (
                    <div key={req.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{req.targetFindingOrItem}</div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{req.requestedInfo}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Justification: {req.justification} • Due Date: {req.dueDate}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrutiny Committee Observations */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-3">
                  Officer Observations Log ({observations.length})
                </h4>

                <form onSubmit={handleCreateObservation} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mb-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select
                        value={newObsCategory}
                        onChange={(e) => setNewObsCategory(e.target.value as OfficerObservationItem['category'])}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                      >
                        <option value="LAND">Land Title & Campus Area</option>
                        <option value="INFRASTRUCTURE">Instructional & Built-up Area</option>
                        <option value="FACULTY">Faculty Ratio & Cadre</option>
                        <option value="SAFETY">Fire & Life Safety</option>
                        <option value="DOCUMENTATION">Documentation & Affidavits</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Requirement / Code</label>
                      <input
                        type="text"
                        required
                        value={newObsField}
                        onChange={(e) => setNewObsField(e.target.value)}
                        placeholder="e.g. REG-2026-BLDG-02"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Severity / Finding</label>
                      <select
                        value={newObsSeverity}
                        onChange={(e) => setNewObsSeverity(e.target.value as OfficerObservationItem['severity'])}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-semibold"
                      >
                        <option value="SATISFACTORY">SATISFACTORY (Compliant)</option>
                        <option value="OBSERVATION">OBSERVATION (Advisory)</option>
                        <option value="ADVERSE">ADVERSE (Deficit Notice)</option>
                        <option value="CRITICAL">CRITICAL (Regulatory Halt)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Officer Observations & Reasoning</label>
                    <textarea
                      rows={2}
                      required
                      value={newObsNotes}
                      onChange={(e) => setNewObsNotes(e.target.value)}
                      placeholder="Detailed observations for review committee records..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0F766E] hover:bg-[#115e59] text-white rounded-lg font-bold text-xs"
                    >
                      Record Observation
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {observations.map((obs) => (
                    <div key={obs.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {obs.category}
                          </span>
                          <span className="font-bold text-slate-800 text-xs">{obs.requirementOrField}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          obs.severity === 'SATISFACTORY' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {obs.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{obs.officerNotes}</p>
                      <div className="text-[10px] text-slate-400">
                        Officer: {obs.reviewerName} • {obs.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUTHORIZED DECISION PANEL */}
          {activeTab === 'DECISION' && (
            <div className="space-y-6">
              {decisionRecord ? (
                <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-900">
                      <Gavel className="w-6 h-6 text-indigo-700" />
                      <h4 className="text-base font-black tracking-tight">
                        Authorized Scrutiny Determination on File
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                      {decisionRecord.outcome.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {decisionRecord.remarks}
                  </p>

                  <div className="border-t border-indigo-100 pt-3 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
                    <div>
                      Decision Maker: <strong className="text-slate-800">{decisionRecord.decisionMaker}</strong> ({decisionRecord.decisionMakerRole})
                    </div>
                    <div>
                      Timestamp: <span className="font-mono text-slate-700">{decisionRecord.decisionTimestamp}</span>
                    </div>
                    <div>
                      Rule Engine Version: <span className="font-mono text-slate-700">{decisionRecord.ruleEngineVersion}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRecordOfficialDecision} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#102B4E]">
                      <Gavel className="w-5 h-5 text-indigo-600" />
                      <h4 className="text-sm font-bold">Record Authorized Internal Scrutiny Outcome</h4>
                    </div>
                    {currentUserRole && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Role: {currentUserRole}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Decision Support Directive:</strong> AuthenX does not autonomously grant or deny statutory approval.
                      Recording an outcome logs an official internal determination for council governance records.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Scrutiny Determination Outcome *
                    </label>
                    <select
                      value={decisionOutcome}
                      onChange={(e) => setDecisionOutcome(e.target.value as AuthorizedDecisionOutcome)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800"
                    >
                      <option value="READY_FOR_COMPETENT_AUTHORITY_REVIEW">
                        Ready for Competent Authority Review (Full Scrutiny Passed)
                      </option>
                      <option value="CLARIFICATION_REQUIRED">
                        Clarification Required (Discrepancy Pending Resolution)
                      </option>
                      <option value="REFERRED_FOR_INSPECTION">
                        Referred for On-Site Physical Inspection (Infrastructure Verification)
                      </option>
                      <option value="FURTHER_SCRUTINY_REQUIRED">
                        Further Scrutiny Required by Regional Scrutiny Board
                      </option>
                      <option value="DECISION_RECORDED">
                        Decision Recorded According to Authorized Workflow
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Statutory Reasoning & Official Remarks *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={decisionRemarks}
                      onChange={(e) => setDecisionRemarks(e.target.value)}
                      placeholder="Comprehensive justification detailing verification of land, built-up area, and faculty cadre per Approval Process Handbook 2026-27..."
                      className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="decisionConfirmCheckbox"
                      checked={decisionConfirmed}
                      onChange={(e) => setDecisionConfirmed(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                    <label htmlFor="decisionConfirmCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      I confirm that I have verified all evidence and the decision is recorded under statutory council authorization.
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!decisionConfirmed}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-500/20 disabled:opacity-40"
                    >
                      <Gavel className="w-4 h-4" /> Formally Record Determination
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Workspace Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] text-slate-400">
            AuthenX Decision Support Console • AY {app.academicYear} Scrutiny Cycle
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Close Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
