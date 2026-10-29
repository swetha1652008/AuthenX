import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Download, 
  Search, 
  ChevronDown, 
  Info,
  UserCheck
} from 'lucide-react';
import type { UserAccount } from '../../types/auth';
import type { InstitutionApplication } from '../../types/institution';

interface IssuingAuthorityHeaderProps {
  application: InstitutionApplication;
  availableApplications: InstitutionApplication[];
  onSelectApplication: (appId: string) => void;
  currentUser: UserAccount | null;
  onNewRequest: () => void;
  onExportReport: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDemoMode: boolean;
}

export const IssuingAuthorityHeader: React.FC<IssuingAuthorityHeaderProps> = ({
  application,
  availableApplications,
  onSelectApplication,
  currentUser,
  onNewRequest,
  onExportReport,
  searchQuery,
  onSearchChange,
  isDemoMode,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Top Bar with Navigation & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#CFE2FE]">
              Issuing Authority Multi-Source Verification
            </span>
            {isDemoMode && (
              <span 
                className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 cursor-help"
                title="Synthetic regulatory records loaded for evaluation. Live external AICTE / State Government APIs require authorized enterprise gateway keys."
              >
                <Info className="w-3.5 h-3.5 text-amber-600" />
                Demo Mode Active
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Multi-Source Verification Active
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#102B4E] tracking-tight">
            Issuing Authority Verification
          </h1>
          <p className="text-xs text-slate-500">
            Smart Multi-Source Document Authentication: Verify certificates across QR codes, reference registries, authorized official APIs, and manual officer scrutiny.
          </p>
        </div>

        {/* Action Controls & Application Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Application Selector Dropdown */}
          <div className="relative">
            <select
              value={application.id}
              onChange={(e) => onSelectApplication(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-[#102B4E] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
            >
              {availableApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.referenceNumber} ({app.type}) — AY {app.academicYear}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={onExportReport}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>

          {/* New Verification Request Button */}
          <button
            type="button"
            onClick={onNewRequest}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Verification</span>
          </button>
        </div>
      </div>

      {/* Second Row: Institution Context & Global Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-[#102B4E]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{application.institution.name}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-500">PID: {application.institution.aictePermanentId}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">AY {application.academicYear} ({application.type})</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 flex items-center gap-1 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            {currentUser?.name || 'Authorized Officer'} ({currentUser?.authorizedRole || 'User'})
          </span>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search request ID, cert no, authority..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
};
