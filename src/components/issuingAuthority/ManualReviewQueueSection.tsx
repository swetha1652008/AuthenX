import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Eye, 
  AlertTriangle, 
  Building2, 
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import type { VerificationRequest } from '../../types/issuingAuthority';
import type { UserAccount } from '../../types/auth';

interface ManualReviewQueueSectionProps {
  requests: VerificationRequest[];
  currentUser: UserAccount | null;
  onOpenDetails: (request: VerificationRequest, initialTab?: string) => void;
  onAssignToMe: (requestId: string) => void;
}

export const ManualReviewQueueSection: React.FC<ManualReviewQueueSectionProps> = ({
  requests,
  currentUser,
  onOpenDetails,
  onAssignToMe,
}) => {
  // Manual Review Queue includes requests that require human scrutiny or are in review
  const queueRequests = useMemo(() => {
    return requests.filter(
      (r) => 
        r.status === 'Manual Review Required' ||
        r.status === 'Under Manual Review' ||
        r.status === 'Additional Documents Required' ||
        r.status === 'Further Investigation Required' ||
        r.status === 'Mismatch Detected' ||
        r.status === 'Expired'
    );
  }, [requests]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [certTypeFilter, setCertTypeFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'submittedAt' | 'id'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Unique Certificate Types for filter
  const certificateTypes = useMemo(() => {
    const set = new Set(queueRequests.map((r) => r.certificateType));
    return Array.from(set);
  }, [queueRequests]);

  const filteredRequests = useMemo(() => {
    return queueRequests.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        r.id.toLowerCase().includes(q) ||
        r.institutionName.toLowerCase().includes(q) ||
        r.certificateNumber.toLowerCase().includes(q) ||
        r.issuingAuthority.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchType = certTypeFilter === 'ALL' || r.certificateType === certTypeFilter;

      return matchSearch && matchStatus && matchType;
    }).sort((a, b) => {
      if (sortField === 'submittedAt') {
        return sortOrder === 'desc' 
          ? b.submittedAt.localeCompare(a.submittedAt)
          : a.submittedAt.localeCompare(b.submittedAt);
      }
      return sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
    });
  }, [queueRequests, searchQuery, statusFilter, certTypeFilter, sortField, sortOrder]);

  const handleSortToggle = (field: 'submittedAt' | 'id') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getReasonBadge = (reason?: string) => {
    if (!reason) return <span className="text-slate-400">Regular Scrutiny</span>;
    return (
      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block truncate max-w-[200px]" title={reason}>
        {reason}
      </span>
    );
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'Manual Review Required':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3 text-amber-500" /> Review Required</span>;
      case 'Under Manual Review':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3 text-blue-500" /> Under Review</span>;
      case 'Additional Documents Required':
        return <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3 text-purple-500" /> Docs Requested</span>;
      case 'Further Investigation Required':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3 text-rose-500" /> Investigation</span>;
      case 'Mismatch Detected':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3 text-rose-500" /> Mismatch</span>;
      case 'Expired':
        return <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3 text-red-500" /> Expired</span>;
      default:
        return <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full w-max">{status}</span>;
    }
  };

  const isOfficerOrAdmin = 
    currentUser?.authorizedRole === 'DOCUMENT_VERIFICATION_OFFICER' ||
    currentUser?.authorizedRole === 'COMPLIANCE_OFFICER' ||
    currentUser?.authorizedRole === 'REGULATORY_ADMIN';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Queue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Method 4 Scrutiny Queue
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
              {queueRequests.length} Cases
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#102B4E] mt-0.5 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Manual Officer Verification Queue
          </h3>
          <p className="text-xs text-slate-500">
            Assigned cases where automated QR, registry, or API checks were inconclusive or identified variances requiring human evaluator judgment.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#2563EB] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Review Statuses</option>
              <option value="Manual Review Required">Manual Review Required</option>
              <option value="Under Manual Review">Under Manual Review</option>
              <option value="Additional Documents Required">Additional Docs Required</option>
              <option value="Further Investigation Required">Further Investigation</option>
              <option value="Mismatch Detected">Mismatch Detected</option>
              <option value="Expired">Expired Certificates</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Cert Type Filter */}
          {certificateTypes.length > 1 && (
            <div className="relative">
              <select
                value={certTypeFilter}
                onChange={(e) => setCertTypeFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#2563EB] focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Certificate Types</option>
                {certificateTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search queue..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Queue Data Grid */}
      {filteredRequests.length > 0 ? (
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
                <th className="py-3 px-4">Certificate Details</th>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">Reason for Review</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 select-none"
                  onClick={() => handleSortToggle('submittedAt')}
                >
                  <div className="flex items-center gap-1">
                    <span>Submitted</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => {
                const isAssignedToCurrent = req.assignedReviewer?.id === currentUser?.id;

                return (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Request ID */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#2563EB]">
                        {req.id}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        {req.applicationReference}
                      </span>
                    </td>

                    {/* Certificate Details */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate" title={req.certificateType}>
                        {req.certificateType}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate" title={req.certificateNumber}>
                        No: {req.certificateNumber}
                      </div>
                    </td>

                    {/* Issuing Authority */}
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-slate-700 truncate block font-medium" title={req.issuingAuthority}>
                        {req.issuingAuthority}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {req.institutionName}
                      </span>
                    </td>

                    {/* Reason for Review */}
                    <td className="py-3 px-4">
                      {getReasonBadge(req.reasonForManualReview)}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {req.submittedAt}
                    </td>

                    {/* Assigned Officer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.assignedReviewer ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="font-semibold text-slate-800 text-xs">
                            {req.assignedReviewer.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Review Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Assign to Me button if unassigned and is officer */}
                        {!req.assignedReviewer && isOfficerOrAdmin && (
                          <button
                            type="button"
                            onClick={() => onAssignToMe(req.id)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold border border-purple-200 transition-colors cursor-pointer"
                          >
                            Assign to Me
                          </button>
                        )}

                        {/* Open Details */}
                        <button
                          type="button"
                          onClick={() => onOpenDetails(req, 'manual-review')}
                          className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAssignedToCurrent ? 'Review Case' : 'View Details'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Cases Currently in Scrutiny Queue</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All submitted certificates have either been automatically verified or reviewed. Any new inconclusive findings will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
};
