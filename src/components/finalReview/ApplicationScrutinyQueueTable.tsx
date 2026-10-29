import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  FileCheck2
} from 'lucide-react';
import type { ScrutinyApplicationSummary } from '../../types/finalReview';

interface Props {
  applications: ScrutinyApplicationSummary[];
  onOpenWorkspace: (appId: string) => void;
  onOpenReportModal: (appId: string) => void;
}

export const ApplicationScrutinyQueueTable: React.FC<Props> = ({
  applications,
  onOpenWorkspace,
  onOpenReportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.applicationRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.institutionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'ALL' || app.applicationCategory === categoryFilter;
      const matchStage = stageFilter === 'ALL' || app.overallStage === stageFilter;

      return matchSearch && matchCategory && matchStage;
    });
  }, [applications, searchTerm, categoryFilter, stageFilter]);

  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStageLabel = (stage: ScrutinyApplicationSummary['overallStage']) => {
    switch (stage) {
      case 'STAGE_1_SUBMITTED': return '1. Submitted';
      case 'STAGE_2_PRE_VALIDATION': return '2. Pre-Validation';
      case 'STAGE_3_DOC_AUTHENTICATION': return '3. Doc Auth';
      case 'STAGE_4_ISSUING_AUTHORITY': return '4. Authority Verify';
      case 'STAGE_5_REGULATORY_CHECKLIST': return '5. Checklist Check';
      case 'STAGE_6_INFRA_EVIDENCE': return '6. Infra Review';
      case 'STAGE_7_OFFICER_SCRUTINY': return '7. Officer Scrutiny';
      case 'STAGE_8_EVIDENCE_INSPECTION': return '8. Evidence / Inspection';
      case 'STAGE_9_DECISION_RECORDED': return '9. Decision Recorded';
    }
  };

  const getPendingActionBadge = (action: ScrutinyApplicationSummary['pendingActionType']) => {
    switch (action) {
      case 'Clarification Requested':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Officer Determination':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Inspection Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Document Missing':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'None':
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search application ref, institution, ID, or officer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Application Category"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Application Scopes</option>
            <option value="EOA">Extension of Approval (EoA)</option>
            <option value="CHANGE">Approval Changes / Intake</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Workflow Stage"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Workflow Stages</option>
            <option value="STAGE_7_OFFICER_SCRUTINY">Stage 7: Officer Scrutiny</option>
            <option value="STAGE_8_EVIDENCE_INSPECTION">Stage 8: Evidence / Inspection</option>
            <option value="STAGE_9_DECISION_RECORDED">Stage 9: Decision Recorded</option>
          </select>
        </div>
      </div>

      {/* Scrutiny Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Application Reference & Campus</th>
              <th className="py-3 px-3">Scope & AY</th>
              <th className="py-3 px-3">Processing Progress</th>
              <th className="py-3 px-3">Compliance & Docs</th>
              <th className="py-3 px-3">Assigned Officer</th>
              <th className="py-3 px-3">Workflow Stage</th>
              <th className="py-3 px-4 text-right">Scrutiny Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedApps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono font-bold text-[#102B4E]">{app.applicationRef}</div>
                  <div className="font-semibold text-slate-800 text-[11px] line-clamp-1">{app.institutionName}</div>
                  <div className="font-mono text-[10px] text-slate-400">AICTE ID: {app.institutionId}</div>
                </td>

                <td className="py-3 px-3">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {app.applicationCategory}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">AY {app.academicYear}</div>
                </td>

                <td className="py-3 px-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-700 mb-1">
                    <span>{app.completenessScore}%</span>
                  </div>
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        app.completenessScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${app.completenessScore}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Automated checks</span>
                </td>

                <td className="py-3 px-3">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block w-fit ${
                      app.regulatoryComplianceStatus === 'Fully Compliant'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {app.regulatoryComplianceStatus}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border inline-block w-fit ${getPendingActionBadge(app.pendingActionType)}`}>
                      Action: {app.pendingActionType}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3 max-w-xs">
                  <div className="font-medium text-slate-700 text-[11px] line-clamp-1">{app.assignedOfficer}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Updated: {app.lastUpdated}</div>
                </td>

                <td className="py-3 px-3">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {getStageLabel(app.overallStage)}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenReportModal(app.id)}
                      title="Preview Scrutiny Report"
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenWorkspace(app.id)}
                      className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Open Workspace
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, filteredApps.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredApps.length}</span> scrutiny applications
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
