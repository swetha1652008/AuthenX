import React from 'react';
import { 
  Building2, 
  FileText, 
  Calendar, 
  UserCheck, 
  PlusCircle, 
  Settings, 
  Download, 
  Search, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import type { InstitutionApplication } from '../../types/institution';
import type { ComplianceAssessment } from '../../types/compliance';

interface ComplianceHeaderProps {
  applications: InstitutionApplication[];
  activeApplication: InstitutionApplication;
  onSelectApplication: (app: InstitutionApplication) => void;
  assessment?: ComplianceAssessment;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUploadModal: () => void;
  onOpenRuleConfigModal: () => void;
  onExportReport: () => void;
  isDemoMode?: boolean;
}

export const ComplianceHeader: React.FC<ComplianceHeaderProps> = ({
  applications,
  activeApplication,
  onSelectApplication,
  assessment,
  searchQuery,
  onSearchChange,
  onOpenUploadModal,
  onOpenRuleConfigModal,
  onExportReport,
  isDemoMode = true,
}) => {
  return (
    <div className="bg-white border-b border-[#CFE2FE] p-4 lg:p-6 shadow-sm">
      {/* Top Bar: Breadcrumb, Demo Mode, Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>AuthenX Council</span>
            <span>/</span>
            <span className="text-[#2563EB] font-semibold">Regulatory & Infrastructure Compliance</span>
            <span>/</span>
            <span className="text-slate-700 font-mono">{activeApplication.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#102B4E]">
              Regulatory & Infrastructure Compliance
            </h1>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Demo Mode Active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Configurable regulatory checks, infrastructure evidence assessment, and inspection assistance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenRuleConfigModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            Configure Rules
          </button>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            + Submit Evidence
          </button>

          <button
            type="button"
            onClick={onExportReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#102B4E] bg-[#EAF2FF] border border-[#CFE2FE] rounded-lg hover:bg-[#D8E8FF] transition shadow-sm"
          >
            <Download className="w-4 h-4 text-[#2563EB]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Context Strip: Institution & Application Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 bg-[#F8FAFC] p-3 rounded-lg text-xs">
        {/* Application Selector */}
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-slate-500 font-medium block">Application Reference:</span>
            <select
              value={activeApplication.id}
              onChange={(e) => {
                const found = applications.find((a) => a.id === e.target.value);
                if (found) onSelectApplication(found);
              }}
              className="w-full bg-white font-mono font-bold text-[#102B4E] border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} ({app.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Institution Info */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 font-medium block">Technical Institution:</span>
            <span className="font-semibold text-slate-800 truncate block title={activeApplication.institution.name}">
              {activeApplication.institution.name}
            </span>
          </div>
        </div>

        {/* Category & Academic Year */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Category & AY:</span>
            <span className="font-semibold text-slate-800">
              {activeApplication.type === 'EOA' ? 'Extension of Approval (EoA)' : 'Approval Changes'} • {activeApplication.academicYear}
            </span>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Assessment Status:</span>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                assessment?.status === 'COMPLIANT'
                  ? 'bg-emerald-100 text-emerald-800'
                  : assessment?.status === 'DEFICIENCIES_NOTED'
                  ? 'bg-rose-100 text-rose-800'
                  : assessment?.status === 'EVIDENCE_REQUESTED'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {assessment?.status?.replace(/_/g, ' ') || 'IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Assigned Officer */}
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] text-slate-500 font-medium block">Assigned Officer:</span>
            <span className="font-semibold text-slate-800 truncate block">
              {assessment?.assignedOfficer || 'Smt. Priya Sharma'}
            </span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="mt-3 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter checklist requirements, evidence files, findings, or inspection notes..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
