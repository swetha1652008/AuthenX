import React from 'react';
import { 
  SlidersHorizontal, 
  Clock, 
  FileQuestion, 
  AlertTriangle, 
  Download, 
  Award, 
  CheckSquare
} from 'lucide-react';

interface OfficerQuickActionsPanelProps {
  onOpenAllApplications: () => void;
  onFilterPendingCases: () => void;
  onFilterMissingDocs: () => void;
  onFilterDiscrepancies: () => void;
  onOpenReports: () => void;
  onNavigateToIssuingAuthority: () => void;
  onNavigateToCompliance: () => void;
}

export const OfficerQuickActionsPanel: React.FC<OfficerQuickActionsPanelProps> = ({
  onOpenAllApplications,
  onFilterPendingCases,
  onFilterMissingDocs,
  onFilterDiscrepancies,
  onOpenReports,
  onNavigateToIssuingAuthority,
  onNavigateToCompliance,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5 mb-6">
      <h3 className="text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-3">
        Executive Scrutiny Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <button
          type="button"
          onClick={onOpenAllApplications}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">All Applications</span>
            <span className="text-[10px] text-slate-500">Master Ledger</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onFilterPendingCases}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Pending Cases</span>
            <span className="text-[10px] text-slate-500">Awaiting Decision</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onFilterMissingDocs}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <FileQuestion className="w-4 h-4 text-rose-600" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Missing Documents</span>
            <span className="text-[10px] text-slate-500">Checklist Incomplete</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onFilterDiscrepancies}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Discrepancies</span>
            <span className="text-[10px] text-slate-500">Deficit & Gaps</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateToCompliance}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Compliance Review</span>
            <span className="text-[10px] text-slate-500">Statutory Assessment</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateToIssuingAuthority}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <Award className="w-4 h-4 text-teal-600" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Issuing Authority</span>
            <span className="text-[10px] text-slate-500">Multi-Source Verification</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenReports}
          className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-left transition flex flex-col items-start gap-2 shadow-2xs"
        >
          <Download className="w-4 h-4 text-purple-600" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Generate Reports</span>
            <span className="text-[10px] text-slate-500">CSV & Summary</span>
          </div>
        </button>
      </div>
    </div>
  );
};
