import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowRight, 
  Eye, 
  Columns, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText
} from 'lucide-react';
import type { 
  AnomalyAlert, 
  AnomalySeverityLevel, 
  AnomalyReviewStatus 
} from '../../types/anomaly';

interface AnomalyAlertCenterProps {
  alerts: AnomalyAlert[];
  selectedFilter: string | null;
  onClearFilter: () => void;
  onReviewAlert: (alert: AnomalyAlert) => void;
  onCompareDocuments: (docAId: string, docBId?: string) => void;
}

export const AnomalyAlertCenter: React.FC<AnomalyAlertCenterProps> = ({
  alerts,
  selectedFilter,
  onClearFilter,
  onReviewAlert,
  onCompareDocuments,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    // Top card filter overrides
    if (selectedFilter) {
      if (selectedFilter === 'STATUS_PENDING' && alert.reviewStatus !== 'PENDING') {
        return false;
      }
      if (selectedFilter !== 'ALL' && selectedFilter !== 'STATUS_PENDING' && alert.category !== selectedFilter) {
        return false;
      }
    }

    if (categoryFilter !== 'ALL' && alert.category !== categoryFilter) {
      return false;
    }

    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) {
      return false;
    }

    if (statusFilter !== 'ALL' && alert.reviewStatus !== statusFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesDoc = alert.documentName.toLowerCase().includes(q);
      const matchesCompared = alert.comparedDocumentName?.toLowerCase().includes(q) ?? false;
      const matchesRule = alert.detectionRule.toLowerCase().includes(q);
      const matchesExplanation = alert.explanation.toLowerCase().includes(q);
      return matchesDoc || matchesCompared || matchesRule || matchesExplanation;
    }

    return true;
  });

  const getSeverityBadge = (severity: AnomalySeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>Critical</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Warning</span>
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            <span>Info</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: AnomalyReviewStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
      case 'UNDER REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Under Review</span>
          </span>
        );
      case 'CONFIRMED ISSUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Confirmed Issue</span>
          </span>
        );
      case 'FALSE POSITIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>False Positive (Cleared)</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#102B4E]">
                Anomaly & Risk Alert Center
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                {filteredAlerts.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              System-generated potential variance flags and cross-document comparison alerts
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedFilter && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200 font-medium">
              <span>Card Filter: <strong className="font-bold">{selectedFilter}</strong></span>
              <button
                type="button"
                onClick={onClearFilter}
                className="ml-1 text-blue-500 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alerts or documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter alerts by category"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Exact Duplicate">Exact Duplicate</option>
              <option value="Possible Duplicate">Possible Duplicate</option>
              <option value="Identifier Mismatch">Identifier Mismatch</option>
              <option value="Date Inconsistency">Date Inconsistency</option>
              <option value="Metadata Anomaly">Metadata Anomaly</option>
              <option value="Possible Alteration">Possible Alteration</option>
            </select>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            aria-label="Filter alerts by severity"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter alerts by review status"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="CONFIRMED ISSUE">Confirmed Issue</option>
            <option value="FALSE POSITIVE">False Positive</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      {filteredAlerts.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No Anomaly Alerts Match Criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {alerts.length === 0 
              ? 'No duplicates, date lapses, or identifier discrepancies detected in the current document batch.'
              : 'Try clearing the active filters or search terms to inspect other alerts.'}
          </p>
          {(selectedFilter || categoryFilter !== 'ALL' || severityFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                onClearFilter();
                setCategoryFilter('ALL');
                setSeverityFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Severity & Category</th>
                <th className="py-3 px-4">Subject Documents</th>
                <th className="py-3 px-4">Detection Rule & AI Finding</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAlerts.map((alert) => (
                <tr 
                  key={alert.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Severity & Category */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 items-start">
                      {getSeverityBadge(alert.severity)}
                      <span className="font-semibold text-slate-700 text-xs">
                        {alert.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(alert.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* Subject Documents */}
                  <td className="py-3.5 px-4 align-top max-w-[260px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-bold text-[#102B4E] truncate" title={alert.documentName}>
                          {alert.documentName}
                        </span>
                      </div>

                      {alert.comparedDocumentName && (
                        <div className="flex items-center gap-1.5 text-slate-500 pl-2 border-l-2 border-slate-200 text-[11px]">
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate" title={alert.comparedDocumentName}>
                            vs. {alert.comparedDocumentName}
                          </span>
                        </div>
                      )}

                      {alert.fieldOrAttribute && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit font-mono">
                          Field: {alert.fieldOrAttribute}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Detection Rule & AI Finding */}
                  <td className="py-3.5 px-4 align-top">
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        {alert.detectionRule}
                      </span>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        {alert.explanation}
                      </p>
                      {alert.supportingEvidence && (
                        <div className="mt-2 text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-600 text-xs overflow-x-auto">
                          <span className="font-bold text-slate-700 block mb-0.5 font-sans text-[10px] uppercase tracking-wider">
                            Supporting Forensic Evidence:
                          </span>
                          {alert.supportingEvidence}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Review Status */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(alert.reviewStatus)}
                      {alert.assignedReviewer && (
                        <span className="text-[10px] text-slate-500">
                          By: {alert.assignedReviewer}
                        </span>
                      )}
                      {alert.reviewerNotes && (
                        <p className="text-[11px] text-slate-600 italic max-w-[160px] truncate" title={alert.reviewerNotes}>
                          &quot;{alert.reviewerNotes}&quot;
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onReviewAlert(alert)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Open Review & Decision Modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>

                      {alert.comparedDocumentId && (
                        <button
                          type="button"
                          onClick={() => onCompareDocuments(alert.documentId, alert.comparedDocumentId)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Open in Side-by-Side Comparison Workspace"
                        >
                          <Columns className="w-3.5 h-3.5 text-teal-600" />
                          <span>Compare</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
