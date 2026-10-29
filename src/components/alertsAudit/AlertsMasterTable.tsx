import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  Calendar, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2 
} from 'lucide-react';
import type { SystemAlert, AlertSeverity, AlertStatus, AlertCategory, SourceModule } from '../../types/alertsAudit';

interface AlertsMasterTableProps {
  alerts: SystemAlert[];
  onSelectAlert: (alert: SystemAlert) => void;
  onUpdateStatus: (alertId: string, newStatus: AlertStatus) => void;
  onAcknowledge: (alertId: string) => void;
  onEscalate: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  activeFilter?: string;
  onFilterChange: (filter: string) => void;
}

export const AlertsMasterTable: React.FC<AlertsMasterTableProps> = ({
  alerts,
  onSelectAlert,
  onUpdateStatus: _onUpdateStatus,
  onAcknowledge,
  onEscalate,
  onResolve,
  activeFilter = 'ALL',
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AlertCategory>('ALL');
  const [moduleFilter, setModuleFilter] = useState<'ALL' | SourceModule>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'severity' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        (item.applicationId && item.applicationId.toLowerCase().includes(q)) ||
        (item.institutionName && item.institutionName.toLowerCase().includes(q)) ||
        (item.assignedOfficer && item.assignedOfficer.toLowerCase().includes(q));

      // Quick KPI filter
      let matchesKpi = true;
      if (activeFilter === 'ACTIVE') {
        matchesKpi = item.status !== 'RESOLVED' && item.status !== 'CLOSED';
      } else if (activeFilter === 'CRITICAL_HIGH') {
        matchesKpi = (item.severity === 'CRITICAL' || item.severity === 'HIGH') && item.status !== 'RESOLVED' && item.status !== 'CLOSED';
      } else if (activeFilter === 'DOCUMENT_ANOMALY') {
        matchesKpi = item.category === 'DOCUMENT_TAMPERING_SUSPECTED' || item.category === 'METADATA_INCONSISTENCY';
      } else if (activeFilter === 'AUTHORITY_MISMATCH') {
        matchesKpi = item.category === 'UNTRUSTED_ISSUING_AUTHORITY' || item.category === 'AUTHORITY_API_TIMEOUT';
      } else if (activeFilter === 'REGULATORY_DEFICIT') {
        matchesKpi = item.category === 'INFRASTRUCTURE_DEFICIT' || item.category === 'FACULTY_CADRE_RATIO_VIOLATION' || item.category === 'EXPIRED_STATUTORY_DOCUMENT';
      } else if (activeFilter === 'RECTIFICATION_OVERDUE') {
        matchesKpi = item.category === 'RECTIFICATION_OVERDUE';
      } else if (activeFilter === 'AWAITING_ACTION') {
        matchesKpi = item.status === 'NEW' || item.status === 'OPEN' || item.status === 'AWAITING_INSTITUTION';
      } else if (activeFilter === 'RESOLVED_30D') {
        matchesKpi = item.status === 'RESOLVED' || item.status === 'CLOSED';
      }

      // Dropdown filters
      const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesModule = moduleFilter === 'ALL' || item.sourceModule === moduleFilter;

      return matchesSearch && matchesKpi && matchesSeverity && matchesCategory && matchesModule;
    });
  }, [alerts, searchQuery, activeFilter, severityFilter, categoryFilter, moduleFilter]);

  // Sort alerts
  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = a.createdAt.localeCompare(b.createdAt);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === 'severity') {
        const order: Record<AlertSeverity, number> = {
          CRITICAL: 5,
          HIGH: 4,
          MEDIUM: 3,
          LOW: 2,
          INFO: 1
        };
        comparison = order[b.severity] - order[a.severity];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredAlerts, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage) || 1;
  const paginatedAlerts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAlerts.slice(start, start + itemsPerPage);
  }, [sortedAlerts, currentPage]);

  const toggleSort = (field: 'createdAt' | 'severity' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">LOW</span>;
      case 'INFO':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">INFO</span>;
    }
  };

  const getStatusBadge = (st: AlertStatus) => {
    switch (st) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">NEW</span>;
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">OPEN</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">ASSIGNED</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">UNDER REVIEW</span>;
      case 'AWAITING_INSTITUTION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">AWAITING INST</span>;
      case 'AWAITING_EXTERNAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">AWAITING EXT</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">ESCALATED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">RESOLVED</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">CLOSED</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search alerts by ID, title, app, institution..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value as 'ALL' | AlertSeverity);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Module */}
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value as 'ALL' | SourceModule);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            <option value="ANOMALY_DETECTION">Anomaly Detection</option>
            <option value="ISSUING_AUTHORITY">Issuing Authority</option>
            <option value="COMPLIANCE">Compliance Engine</option>
            <option value="DOCUMENT_VAULT">Document Vault</option>
            <option value="HUMAN_REVIEW">Human Review</option>
            <option value="SECURITY">Security</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as 'ALL' | AlertCategory);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="DOCUMENT_TAMPERING_SUSPECTED">Tampering Suspected</option>
            <option value="UNTRUSTED_ISSUING_AUTHORITY">Untrusted Authority</option>
            <option value="FACULTY_CADRE_RATIO_VIOLATION">Faculty Cadre Deficit</option>
            <option value="EXPIRED_STATUTORY_DOCUMENT">Expired Document</option>
            <option value="RECTIFICATION_OVERDUE">Rectification Overdue</option>
            <option value="GEO_LOCATION_MISMATCH">Geo-Location Mismatch</option>
            <option value="UNAUTHORIZED_ACCESS_ATTEMPT">Security Incident</option>
          </select>

          {/* Quick Clear Filter */}
          {activeFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => onFilterChange('ALL')}
              className="text-xs text-blue-600 hover:underline font-semibold px-2"
            >
              Reset Filters
            </button>
          )}

          <span className="text-xs text-slate-400 font-medium">
            Total: {sortedAlerts.length}
          </span>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Alert ID & Category</th>
              <th className="py-3 px-4">Alert Subject & Scope</th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => toggleSort('severity')}
                  className="flex items-center gap-1 hover:text-slate-800"
                >
                  Severity <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">Source Module</th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => toggleSort('status')}
                  className="flex items-center gap-1 hover:text-slate-800"
                >
                  Status <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => toggleSort('createdAt')}
                  className="flex items-center gap-1 hover:text-slate-800"
                >
                  Created <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No alerts match the active criteria</p>
                  <p className="text-[11px] mt-1">Try resetting the filter to All Active Alerts.</p>
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alt) => {
                const isResolved = alt.status === 'RESOLVED' || alt.status === 'CLOSED';

                return (
                  <tr key={alt.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* ID & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#102B4E]">{alt.id}</div>
                      <span className="inline-block mt-0.5 text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                        {alt.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Subject & Institution */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-bold text-slate-900 text-xs truncate" title={alt.title}>
                        {alt.title}
                      </div>
                      {alt.institutionName && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{alt.institutionName} ({alt.applicationId})</span>
                        </div>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getSeverityBadge(alt.severity)}
                    </td>

                    {/* Source Module */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {alt.sourceModule.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(alt.status)}
                    </td>

                    {/* Created */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{alt.createdAt.split('T')[0]}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectAlert(alt)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white flex items-center gap-1 shadow-sm transition-colors"
                          title="Open Alert Details & Actions"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>

                        {!isResolved && alt.status === 'NEW' && (
                          <button
                            type="button"
                            onClick={() => onAcknowledge(alt.id)}
                            className="p-1.5 rounded-lg text-sky-700 hover:bg-sky-50 border border-slate-200"
                            title="Acknowledge Alert"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isResolved && alt.status !== 'ESCALATED' && (
                          <button
                            type="button"
                            onClick={() => onEscalate(alt.id)}
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-slate-200"
                            title="Escalate Alert"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isResolved && (
                          <button
                            type="button"
                            onClick={() => onResolve(alt.id)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-slate-200"
                            title="Mark Resolved"
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

      {/* Pagination */}
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
