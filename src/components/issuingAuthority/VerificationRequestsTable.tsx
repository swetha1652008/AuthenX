import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  GitCompare, 
  History, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { VerificationRequest } from '../../types/issuingAuthority';
import type { UserAccount } from '../../types/auth';

interface VerificationRequestsTableProps {
  requests: VerificationRequest[];
  currentUser: UserAccount | null;
  onOpenDetails: (request: VerificationRequest, initialTab?: string) => void;
  onOpenComparison: (request: VerificationRequest) => void;
  onSendForManualReview: (request: VerificationRequest) => void;
  externalStatusFilter?: string; // from top dashboard cards
}

export const VerificationRequestsTable: React.FC<VerificationRequestsTableProps> = ({
  requests,
  currentUser: _currentUser,
  onOpenDetails,
  onOpenComparison,
  onSendForManualReview,
  externalStatusFilter = 'ALL',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [authorityFilter, setAuthorityFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'submittedAt' | 'id' | 'status'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract authorities for filter
  const authorities = useMemo(() => {
    const set = new Set(requests.map((r) => r.issuingAuthority));
    return Array.from(set);
  }, [requests]);

  // Combined Filtering
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        r.id.toLowerCase().includes(q) ||
        r.institutionName.toLowerCase().includes(q) ||
        r.certificateNumber.toLowerCase().includes(q) ||
        r.referenceNumber.toLowerCase().includes(q) ||
        r.issuingAuthority.toLowerCase().includes(q);

      // External status filter from dashboard cards
      let matchExternal = true;
      if (externalStatusFilter === 'VERIFIED') {
        matchExternal = r.status === 'Verified' || r.status === 'Confirmed Against Official Evidence';
      } else if (externalStatusFilter === 'MISMATCH') {
        matchExternal = r.status === 'Mismatch Detected';
      } else if (externalStatusFilter === 'PENDING') {
        matchExternal = r.status === 'Verification Pending' || r.status === 'Under Manual Review';
      } else if (externalStatusFilter === 'MANUAL_REVIEW') {
        matchExternal = 
          r.status === 'Manual Review Required' ||
          r.status === 'Under Manual Review' ||
          r.status === 'Additional Documents Required' ||
          r.status === 'Further Investigation Required';
      }

      const matchMethod = methodFilter === 'ALL' || r.verificationMethods.includes(methodFilter as VerificationRequest['verificationMethods'][number]);
      const matchAuth = authorityFilter === 'ALL' || r.issuingAuthority === authorityFilter;

      return matchSearch && matchExternal && matchMethod && matchAuth;
    }).sort((a, b) => {
      if (sortField === 'submittedAt') {
        return sortOrder === 'desc' ? b.submittedAt.localeCompare(a.submittedAt) : a.submittedAt.localeCompare(b.submittedAt);
      }
      if (sortField === 'status') {
        return sortOrder === 'desc' ? b.status.localeCompare(a.status) : a.status.localeCompare(b.status);
      }
      return sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
    });
  }, [requests, searchQuery, externalStatusFilter, methodFilter, authorityFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const handleSortToggle = (field: 'submittedAt' | 'id' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'Verified':
      case 'Confirmed Against Official Evidence':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> {status}</span>;
      case 'Mismatch Detected':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3 text-rose-600" /> Mismatch Detected</span>;
      case 'Expired':
        return <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3 text-red-500" /> Expired</span>;
      case 'Manual Review Required':
      case 'Under Manual Review':
      case 'Additional Documents Required':
      case 'Further Investigation Required':
        return <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 w-max"><UserCheck className="w-3 h-3 text-purple-600" /> {status}</span>;
      case 'Verification Pending':
      default:
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3 text-amber-600" /> {status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Table Header with Search & Multi-Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
              Requests Registry
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {filteredRequests.length} of {requests.length} Records
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#102B4E] mt-0.5">
            Verification Requests Master Ledger
          </h3>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Method Filter */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#2563EB] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Methods</option>
              <option value="QR_CODE">QR Code</option>
              <option value="REFERENCE_NUMBER">Reference No</option>
              <option value="OFFICIAL_API">Official API</option>
              <option value="MANUAL_OFFICER">Manual Officer</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Authority Filter */}
          {authorities.length > 1 && (
            <div className="relative">
              <select
                value={authorityFilter}
                onChange={(e) => {
                  setAuthorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#2563EB] focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                <option value="ALL">All Issuing Authorities</option>
                {authorities.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search table..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-inner">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-800 select-none"
                onClick={() => handleSortToggle('id')}
              >
                <div className="flex items-center gap-1">
                  <span>Request ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Certificate & Type</th>
              <th className="py-3 px-4">Issuing Authority</th>
              <th className="py-3 px-4">Method Channels</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-800 select-none"
                onClick={() => handleSortToggle('status')}
              >
                <div className="flex items-center gap-1">
                  <span>Current Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Reviewer</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-800 select-none"
                onClick={() => handleSortToggle('submittedAt')}
              >
                <div className="flex items-center gap-1">
                  <span>Submitted</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Request ID */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-[#2563EB] block">
                    {req.id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {req.applicationReference}
                  </span>
                </td>

                {/* Certificate */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-bold text-slate-900 truncate" title={req.certificateType}>
                    {req.certificateType}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 truncate" title={req.certificateNumber}>
                    {req.certificateNumber}
                  </div>
                </td>

                {/* Authority */}
                <td className="py-3.5 px-4 max-w-xs">
                  <span className="text-slate-800 truncate block font-medium" title={req.issuingAuthority}>
                    {req.issuingAuthority}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 shrink-0" />
                    {req.institutionName}
                  </span>
                </td>

                {/* Methods */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {req.verificationMethods.map((m) => (
                      <span key={m} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {m.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(req.status)}
                </td>

                {/* Reviewer */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {req.assignedReviewer ? (
                    <span className="font-semibold text-slate-800 text-xs">
                      {req.assignedReviewer.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">
                      Automated
                    </span>
                  )}
                </td>

                {/* Submitted */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                  {req.submittedAt}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onOpenDetails(req, 'overview')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Compare Records */}
                    <button
                      type="button"
                      onClick={() => onOpenComparison(req)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Compare Records"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>

                    {/* Send to Manual Review */}
                    {req.status !== 'Verified' && req.status !== 'Confirmed Against Official Evidence' && (
                      <button
                        type="button"
                        onClick={() => onSendForManualReview(req)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                        title="Send for Manual Review"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* View Audit Trail */}
                    <button
                      type="button"
                      onClick={() => onOpenDetails(req, 'audit-trail')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="View Audit Trail"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div>
          Showing {paginatedRequests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-700 font-mono">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
