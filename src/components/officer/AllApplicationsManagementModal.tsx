import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  FileCheck2,
  FileText,
  ShieldAlert,
  Award,
  CheckSquare
} from 'lucide-react';
import { officerDashboardService } from '../../services/officerDashboardService';
import type { ApplicationFilterOptions } from '../../types/officerDashboard';

interface AllApplicationsManagementModalProps {
  onClose: () => void;
  onNavigateToPage: (page: string, appId: string) => void;
  initialFilter?: Partial<ApplicationFilterOptions>;
}

export const AllApplicationsManagementModal: React.FC<AllApplicationsManagementModalProps> = ({
  onClose,
  onNavigateToPage,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilter?.searchQuery || '');
  const [applicationType, setApplicationType] = useState<'ALL' | 'EOA' | 'CHANGE'>(
    initialFilter?.applicationType || 'ALL'
  );
  const [academicYear, setAcademicYear] = useState(initialFilter?.academicYear || '');
  const [documentStatus, setDocumentStatus] = useState(initialFilter?.documentStatus || '');
  const [validationStatus, setValidationStatus] = useState(initialFilter?.validationStatus || '');
  const [sortField, setSortField] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filters: ApplicationFilterOptions = {
    searchQuery,
    applicationType,
    academicYear: academicYear || undefined,
    documentStatus: documentStatus || undefined,
    validationStatus: validationStatus || undefined,
  };

  const { items, totalCount, totalPages } = officerDashboardService.getAllApplications(
    filters,
    sortField,
    sortOrder,
    page,
    pageSize
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setApplicationType('ALL');
    setAcademicYear('');
    setDocumentStatus('');
    setValidationStatus('');
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                All Applications Scrutiny Ledger & Institutional Directory
              </h3>
              <p className="text-xs text-slate-500">
                Search, multi-filter, sort, and navigate directly into specific validation and compliance modules.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-2.5">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search Application ID, Institution Name, or PID..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
            </div>

            {/* Type */}
            <div>
              <select
                value={applicationType}
                onChange={(e) => {
                  setApplicationType(e.target.value as 'ALL' | 'EOA' | 'CHANGE');
                  setPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Application Types</option>
                <option value="EOA">Extension of Approval (EoA)</option>
                <option value="CHANGE">Approval Changes</option>
              </select>
            </div>

            {/* Document Status */}
            <div>
              <select
                value={documentStatus}
                onChange={(e) => {
                  setDocumentStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Document States</option>
                <option value="All Uploaded">All Uploaded</option>
                <option value="Missing Required">Missing Required</option>
                <option value="Expired Detected">Expired Detected</option>
                <option value="Under Audit">Under Audit</option>
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <select
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Academic Years</option>
                <option value="2026-2027">AY 2026-2027</option>
                <option value="2025-2026">AY 2025-2026</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Showing {items.length} of {totalCount} matching dossiers
            </span>
            {(searchQuery || applicationType !== 'ALL' || documentStatus || academicYear) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#2563EB] font-bold hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Master Table */}
        <div className="flex-1 overflow-y-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600 sticky top-0 z-10">
                <th
                  onClick={() => handleSort('id')}
                  className="py-2.5 px-3 cursor-pointer hover:text-blue-600"
                >
                  <span className="flex items-center gap-1">
                    Application ID <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('institutionName')}
                  className="py-2.5 px-3 cursor-pointer hover:text-blue-600"
                >
                  <span className="flex items-center gap-1">
                    Institution <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-2.5 px-2 text-center">Type & AY</th>
                <th className="py-2.5 px-2 text-center">Document Status</th>
                <th className="py-2.5 px-2 text-center">Validation Status</th>
                <th className="py-2.5 px-2 text-center">Gaps</th>
                <th className="py-2.5 px-3 text-right">Module Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50/30 transition">
                  {/* ID */}
                  <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">
                    {app.id}
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Updated: {app.lastUpdated}
                    </span>
                  </td>

                  {/* Institution */}
                  <td className="py-3 px-3 max-w-xs">
                    <p className="font-bold text-slate-900 line-clamp-1" title={app.institutionName}>
                      {app.institutionName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">PID: {app.institutionId}</p>
                  </td>

                  {/* Type & AY */}
                  <td className="py-3 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {app.applicationType} • {app.academicYear}
                    </span>
                  </td>

                  {/* Document Status */}
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.documentStatus === 'All Uploaded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.documentStatus === 'Missing Required'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {app.documentStatus}
                    </span>
                  </td>

                  {/* Validation Status */}
                  <td className="py-3 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {app.validationStatus}
                    </span>
                  </td>

                  {/* Gaps Count */}
                  <td className="py-3 px-2 text-center font-mono">
                    {app.unresolvedDiscrepancyCount > 0 ? (
                      <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                        {app.unresolvedDiscrepancyCount} Deficit(s)
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[10px]">0</span>
                    )}
                  </td>

                  {/* Direct Module Drill-Down Links */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onNavigateToPage('documents', app.id)}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                        title="Open Statutory Document Vault"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToPage('validation', app.id)}
                        className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
                        title="Open AI Document Validation"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToPage('anomalies', app.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                        title="Open Document Anomaly Detection"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToPage('issuing-authority', app.id)}
                        className="p-1 rounded text-slate-500 hover:text-teal-600 hover:bg-slate-100"
                        title="Open Issuing Authority Verification"
                      >
                        <Award className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToPage('compliance', app.id)}
                        className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                        title="Open Regulatory & Infrastructure Compliance"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
