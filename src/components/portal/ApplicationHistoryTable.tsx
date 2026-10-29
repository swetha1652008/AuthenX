import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import type { 
  InstitutionApplication, 
  ApplicationStatus, 
  ValidationStatus 
} from '../../types/institution';

interface ApplicationHistoryTableProps {
  applications: InstitutionApplication[];
  onViewDetails: (app: InstitutionApplication) => void;
  onEditDraft: (app: InstitutionApplication) => void;
  onContinueRectification: (app: InstitutionApplication) => void;
  externalFilter?: string;
  searchQuery?: string;
}

export const ApplicationHistoryTable: React.FC<ApplicationHistoryTableProps> = ({
  applications,
  onViewDetails,
  onEditDraft,
  onContinueRectification,
  externalFilter = 'ALL',
  searchQuery = '',
}) => {
  // Local Filter & Sort State
  const [localSearch, setLocalSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedAppStatus, setSelectedAppStatus] = useState<string>('ALL');
  const [selectedValStatus, setSelectedValStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'createdAt' | 'referenceNumber' | 'updatedAt'>('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Combine top-level search and local search
  const effectiveSearch = (searchQuery || localSearch).trim().toLowerCase();

  // Filter application records
  const filtered = applications.filter((app) => {
    // Top summary card filter
    if (externalFilter === 'DRAFT' && app.status !== 'Draft') return false;
    if (
      externalFilter === 'REVIEW' &&
      !['Under Official Review', 'Submitted', 'Verification Pending'].includes(app.status)
    )
      return false;
    if (
      externalFilter === 'ACTION' &&
      app.status !== 'Rectification Required' &&
      app.validationStatus !== 'Mismatch Detected'
    )
      return false;

    // Academic Year filter
    if (selectedYear !== 'ALL' && app.academicYear !== selectedYear) return false;

    // Application Status filter
    if (selectedAppStatus !== 'ALL' && app.status !== selectedAppStatus) return false;

    // Validation Status filter
    if (selectedValStatus !== 'ALL' && app.validationStatus !== selectedValStatus) return false;

    // Search query matching ref number, purpose, or change category
    if (effectiveSearch) {
      const matchRef = app.referenceNumber.toLowerCase().includes(effectiveSearch);
      const matchType = app.type.toLowerCase().includes(effectiveSearch);
      const matchCat = (app.changeCategory || '').toLowerCase().includes(effectiveSearch);
      const matchPurpose = app.purposeRemarks.toLowerCase().includes(effectiveSearch);
      if (!matchRef && !matchType && !matchCat && !matchPurpose) return false;
    }

    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'createdAt') {
      cmp = a.createdAt.localeCompare(b.createdAt);
    } else if (sortField === 'updatedAt') {
      cmp = a.updatedAt.localeCompare(b.updatedAt);
    } else if (sortField === 'referenceNumber') {
      cmp = a.referenceNumber.localeCompare(b.referenceNumber);
    }
    return sortAsc ? cmp : -cmp;
  });

  const handleSortToggle = (field: 'createdAt' | 'referenceNumber' | 'updatedAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getAppStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Ready for Submission':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'Submitted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-300';
      case 'Verification Pending':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Rectification Required':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Under Official Review':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getValidationStatusBadge = (valStatus: ValidationStatus) => {
    switch (valStatus) {
      case 'Verified by Authorized Source':
      case 'Preliminary Check Passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Passed</span>
          </span>
        );
      case 'Mismatch Detected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Mismatch</span>
          </span>
        );
      case 'Manual Review Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" />
            <span>Officer Review</span>
          </span>
        );
      case 'Verification Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Check</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#CFE2FE] shadow-card overflow-hidden">
      {/* Table Header & Controls Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-[#102B4E]">
              Application History & Tracking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review submission progress, preliminary AI audits, and scrutiny status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-slate-800">{sorted.length}</strong> applications
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search reference..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CFE2FE] text-xs text-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {/* Academic Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="ALL">All Academic Years</option>
              <option value="2026-2027">AY 2026–2027</option>
              <option value="2027-2028">AY 2027–2028</option>
            </select>
          </div>

          {/* Application Status Filter */}
          <div>
            <select
              value={selectedAppStatus}
              onChange={(e) => setSelectedAppStatus(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Ready for Submission">Ready for Submission</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Official Review">Under Official Review</option>
              <option value="Rectification Required">Rectification Required</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Validation Status Filter */}
          <div>
            <select
              value={selectedValStatus}
              onChange={(e) => setSelectedValStatus(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CFE2FE] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="ALL">All Validation States</option>
              <option value="Preliminary Check Passed">Preliminary Check Passed</option>
              <option value="Mismatch Detected">Mismatch Detected</option>
              <option value="Manual Review Required">Manual Review Required</option>
              <option value="Verification Pending">Verification Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-[#2563EB]"
                onClick={() => handleSortToggle('referenceNumber')}
              >
                <div className="flex items-center gap-1">
                  <span>Application Ref</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Type & Details</th>
              <th className="py-3.5 px-3">AY</th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-[#2563EB]"
                onClick={() => handleSortToggle('updatedAt')}
              >
                <div className="flex items-center gap-1">
                  <span>Last Updated</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Preliminary Audit</th>
              <th className="py-3.5 px-4">Portal Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sorted.length > 0 ? (
              sorted.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-[#F8FAFC] transition-colors group"
                >
                  {/* Reference Number */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#102B4E] block">
                      {app.referenceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Created: {app.createdAt}
                    </span>
                  </td>

                  {/* Type & Purpose */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          app.type === 'EOA'
                            ? 'bg-[#EAF2FF] text-[#2563EB]'
                            : 'bg-[#DDF7FA] text-[#0A588C]'
                        }`}
                      >
                        {app.type === 'EOA' ? 'EoA' : 'Change Request'}
                      </span>
                      {app.changeCategory && (
                        <span className="text-[10px] font-semibold text-slate-600 truncate">
                          {app.changeCategory}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] truncate" title={app.purposeRemarks}>
                      {app.purposeRemarks}
                    </p>
                  </td>

                  {/* Academic Year */}
                  <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                    {app.academicYear}
                  </td>

                  {/* Last Updated */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {app.updatedAt}
                  </td>

                  {/* Validation Status */}
                  <td className="py-3.5 px-4">
                    {getValidationStatusBadge(app.validationStatus)}
                  </td>

                  {/* Application Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getAppStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(app)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#2563EB] hover:text-white text-slate-700 transition-colors font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                        title="View Full Application Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {app.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => onEditDraft(app)}
                          className="px-2.5 py-1 rounded-lg bg-[#EAF2FF] hover:bg-[#2563EB] hover:text-white text-[#2563EB] transition-colors font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Continue Editing Draft"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}

                      {app.status === 'Rectification Required' && (
                        <button
                          type="button"
                          onClick={() => onContinueRectification(app)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 transition-colors font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Open Rectification Workspace"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Rectify</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold">No applications found matching criteria.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search terms or filter selections above.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
