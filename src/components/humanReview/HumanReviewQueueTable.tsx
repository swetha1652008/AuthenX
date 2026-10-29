import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Eye, 
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import type { HumanReviewCase, HumanReviewStatus, ReviewPriority } from '../../types/humanReview';

interface HumanReviewQueueTableProps {
  cases: HumanReviewCase[];
  onSelectCase: (caseItem: HumanReviewCase) => void;
  onRequestRectification: (caseItem: HumanReviewCase) => void;
  onTriggerRevalidation: (caseItem: HumanReviewCase) => void;
  onQuickResolve: (caseItem: HumanReviewCase) => void;
  activeFilter?: string;
  onFilterChange: (filter: string) => void;
}

export const HumanReviewQueueTable: React.FC<HumanReviewQueueTableProps> = ({
  cases,
  onSelectCase,
  onRequestRectification,
  onTriggerRevalidation,
  onQuickResolve,
  activeFilter = 'ALL',
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | ReviewPriority>('ALL');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'updatedAt'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.applicationId.toLowerCase().includes(q) ||
        item.institutionName.toLowerCase().includes(q) ||
        item.programCourse.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.assignedOfficer.toLowerCase().includes(q);

      // Status
      let matchesStatus = true;
      if (activeFilter === 'PENDING') {
        matchesStatus = item.status === 'PENDING' || item.status === 'UNDER_REVIEW';
      } else if (activeFilter === 'HIGH_PRIORITY') {
        matchesStatus = item.priority === 'CRITICAL' || item.priority === 'HIGH';
      } else if (activeFilter !== 'ALL') {
        matchesStatus = item.status === activeFilter;
      }

      // Priority
      const matchesPriority =
        priorityFilter === 'ALL' || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchQuery, activeFilter, priorityFilter]);

  // Sort cases
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortBy === 'updatedAt') {
        comparison = a.updatedAt.localeCompare(b.updatedAt);
      } else if (sortBy === 'priority') {
        const order: Record<ReviewPriority, number> = {
          CRITICAL: 4,
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1
        };
        comparison = order[b.priority] - order[a.priority];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredCases, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedCases.length / itemsPerPage) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCases.slice(start, start + itemsPerPage);
  }, [sortedCases, currentPage]);

  const toggleSort = (field: 'dueDate' | 'priority' | 'updatedAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getPriorityBadge = (priority: ReviewPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: HumanReviewStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Pending Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            Under Review
          </span>
        );
      case 'RECTIFICATION_REQUESTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Rectification Requested
          </span>
        );
      case 'REVALIDATION_PENDING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Re-validation Ready
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            Review Completed
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Application ID, Institution, Course, Officer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={activeFilter}
            onChange={(e) => {
              onFilterChange(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending & Under Review</option>
            <option value="RECTIFICATION_REQUESTED">Rectification Requested</option>
            <option value="REVALIDATION_PENDING">Re-validation Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value as 'ALL' | ReviewPriority);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <span className="text-xs text-slate-400 font-medium ml-2">
            Showing {sortedCases.length} case{sortedCases.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Application & Institution</th>
              <th className="py-3 px-4">Program / Course</th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => toggleSort('priority')}
                  className="flex items-center gap-1 hover:text-slate-800"
                >
                  Priority <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">Flagged Findings</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => toggleSort('dueDate')}
                  className="flex items-center gap-1 hover:text-slate-800"
                >
                  Due Date <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">Assigned Officer</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No review cases match the selected filters</p>
                  <p className="text-[11px] mt-1">Try resetting the search query or status filter.</p>
                </td>
              </tr>
            ) : (
              paginatedCases.map((item) => {
                const isOverdue = item.status !== 'COMPLETED' && item.status !== 'RESOLVED' && item.dueDate < '2026-10-28';

                return (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* App & Institution */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#102B4E]">{item.applicationId}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[190px]">{item.institutionName}</span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.applicationType} • {item.region}
                      </span>
                    </td>

                    {/* Program */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="font-medium text-slate-800 truncate" title={item.programCourse}>
                        {item.programCourse}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Case: {item.id}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(item.priority)}
                    </td>

                    {/* Findings */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="font-semibold text-slate-800 text-[11px]">
                        {item.findingsCount} Flagged Item{item.findingsCount === 1 ? '' : 's'}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5" title={item.findingSummary}>
                        {item.findingSummary}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.dueDate}</span>
                      </div>
                      {isOverdue && (
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">
                          Overdue
                        </span>
                      )}
                    </td>

                    {/* Assigned Officer */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium text-[11px] truncate max-w-[140px]" title={item.assignedOfficer}>
                        {item.assignedOfficer}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectCase(item)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white flex items-center gap-1 shadow-sm transition-colors"
                          title="Open detailed case review workspace"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>

                        <button
                          type="button"
                          onClick={() => onRequestRectification(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-colors"
                          title="Issue Rectification Notice"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {item.status === 'REVALIDATION_PENDING' && (
                          <button
                            type="button"
                            onClick={() => onTriggerRevalidation(item)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors animate-pulse"
                            title="Trigger AI Re-validation"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.status !== 'RESOLVED' && item.status !== 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => onQuickResolve(item)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-slate-200 transition-colors"
                            title="Resolve All Findings"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
