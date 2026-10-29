import React from 'react';
import { 
  Building2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  UserCheck, 
  ArrowLeft,
  ChevronDown,
  Video
} from 'lucide-react';
import type { UserAccount } from '../../types/auth';
import type { InstitutionApplication } from '../../types/institution';

interface DocumentHeaderProps {
  application: InstitutionApplication;
  currentUser: UserAccount | null;
  onBackToPortal: () => void;
  availableApplications: InstitutionApplication[];
  onSelectApplication: (appId: string) => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  application,
  currentUser,
  onBackToPortal,
  availableApplications,
  onSelectApplication,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Top Bar with Navigation & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={onBackToPortal}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EAF2FF] text-[#102B4E] hover:text-[#2563EB] border border-slate-200 transition-colors cursor-pointer"
            title="Return to Institution Portal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#CFE2FE]">
                Statutory Documents Vault
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Context
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#102B4E] tracking-tight mt-1">
              Document Upload & Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload, organize, review, and validate supporting statutory documents for AICTE approval applications.
            </p>
          </div>
        </div>

        {/* Actions & Application Selector */}
        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          <a
            href="/demo-presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-sm"
            title="Launch Interactive Demo Video Walkthrough & Presentation"
          >
            <Video className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Demo Video Guide</span>
          </a>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Application:
            </label>
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
          </div>
        </div>
      </div>

      {/* Institutional Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
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
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Year</span>
            <span className="font-bold text-slate-800 truncate block">
              AY {application.academicYear}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Category & Status</span>
            <span className="font-semibold text-slate-800 truncate block">
              {application.type === 'EOA' ? 'Extension of Approval' : application.changeCategory || 'Approval Change'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center gap-2.5 col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Role</span>
            <span className="font-bold text-slate-800 truncate block">
              {currentUser?.name || 'Institution Administrator'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
