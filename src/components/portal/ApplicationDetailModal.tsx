import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Building2, 
  GraduationCap, 
  Files, 
  ShieldCheck, 
  AlertTriangle, 
  History 
} from 'lucide-react';
import type { InstitutionApplication } from '../../types/institution';

interface ApplicationDetailModalProps {
  application: InstitutionApplication | null;
  onClose: () => void;
  onEdit?: (app: InstitutionApplication) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'documents' | 'findings' | 'timeline'
  >('overview');

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#CFE2FE]">
                {application.referenceNumber}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AY {application.academicYear}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102B4E]">
              {application.type === 'EOA' ? 'Extension of Approval (EoA)' : application.changeCategory || 'Change Request'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {application.status === 'Draft' && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(application);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                Edit Draft
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Profile', icon: FileText },
            { id: 'courses', label: `Courses & Intake (${application.courses.length})`, icon: GraduationCap },
            { id: 'documents', label: `Documents Vault (${application.documents.length})`, icon: Files },
            { id: 'findings', label: `AI Findings & Audit (${application.findings.length})`, icon: ShieldCheck },
            { id: 'timeline', label: `Activity Timeline (${application.timeline.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Application Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Application Status</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{application.status}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Preliminary AI Audit</span>
                  <p className="font-extrabold text-[#2563EB] text-sm mt-0.5">{application.validationStatus}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Approved Intake</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                    {application.courses.reduce((acc, c) => acc + c.approvedIntake, 0)} Seats
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Verified Docs</span>
                  <p className="font-extrabold text-emerald-600 text-sm mt-0.5">
                    {application.documents.filter((d) => d.status === 'Verified').length} / {application.documents.length}
                  </p>
                </div>
              </div>

              {/* Institution Information Panel */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#CFE2FE] space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="text-sm font-bold text-[#102B4E]">Registered Technical Institution</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Institution Name:</span>
                    <span className="font-bold text-slate-800">{application.institution.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">AICTE Permanent ID (PID):</span>
                    <span className="font-mono font-bold text-slate-800">{application.institution.aictePermanentId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Institution Type:</span>
                    <span className="font-semibold text-slate-700">{application.institution.institutionType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">AISHE Code:</span>
                    <span className="font-mono text-slate-700">{application.institution.aisheCode}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Campus Address:</span>
                    <span className="text-slate-700">{application.institution.fullAddress}</span>
                  </div>
                </div>
              </div>

              {/* Rectification Notes & Officer Observations (if present) */}
              {application.rectificationNotes && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Rectification Action Required</span>
                  </div>
                  <p className="leading-relaxed">{application.rectificationNotes}</p>
                </div>
              )}

              {application.officerObservations && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-800">
                  <div className="flex items-center gap-2 font-bold mb-1 text-[#2563EB]">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Officer Observation (Scrutiny Cell)</span>
                  </div>
                  <p className="leading-relaxed">{application.officerObservations}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSES & FACULTY */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Course / Programme Name</th>
                      <th className="p-3">Level</th>
                      <th className="p-3">Approved</th>
                      <th className="p-3">Proposed</th>
                      <th className="p-3">Faculty</th>
                      <th className="p-3">Cadre Ratio Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {application.courses.map((crs) => (
                      <tr key={crs.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{crs.programmeName}</td>
                        <td className="p-3 text-slate-600">{crs.degreeLevel}</td>
                        <td className="p-3 font-semibold text-slate-700">{crs.approvedIntake}</td>
                        <td className="p-3 font-semibold text-slate-700">{crs.proposedIntake}</td>
                        <td className="p-3 font-semibold text-slate-700">{crs.facultyCount}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (crs.facultyRatioStatus || '').includes('Compliant')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {crs.facultyRatioStatus || '1:15 Standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {application.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs line-clamp-2">{doc.name}</h5>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Size: {doc.fileSize} • Uploaded: {doc.uploadDate}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                      <span className="font-medium text-slate-600">Verification Source: </span>
                      <span>{doc.verificationSource || 'Cryptographic Validation'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINDINGS */}
          {activeTab === 'findings' && (
            <div className="space-y-3">
              {application.findings.map((fnd) => (
                <div
                  key={fnd.id}
                  className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                    fnd.severity === 'CRITICAL'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : fnd.severity === 'WARNING'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : fnd.severity === 'NOTICE'
                      ? 'bg-blue-50 border-blue-200 text-slate-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{fnd.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border">
                      {fnd.severity}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{fnd.explanation}</p>
                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                    <span>
                      <strong>Related:</strong> {fnd.relatedFieldOrDoc}
                    </span>
                    <span className="italic">{fnd.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {application.timeline.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#2563EB] ring-4 ring-white" />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#102B4E]">{evt.eventType}</span>
                        <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{evt.notes}</p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        Actor: {evt.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
          <span className="text-slate-400">
            AuthenX AICTE Sandbox • Verification Decision Support Only
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#102B4E] hover:bg-[#2563EB] transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
