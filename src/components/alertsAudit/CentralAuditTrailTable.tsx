import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  History, 
  Calendar, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import type { CentralAuditLog, SourceModule } from '../../types/alertsAudit';
import { alertsAuditService } from '../../services/alertsAuditService';

interface CentralAuditTrailTableProps {
  logs: CentralAuditLog[];
}

export const CentralAuditTrailTable: React.FC<CentralAuditTrailTableProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'ALL' | SourceModule>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.id.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.applicationId && log.applicationId.toLowerCase().includes(q)) ||
        log.changeSummary.toLowerCase().includes(q) ||
        (log.officerJustification && log.officerJustification.toLowerCase().includes(q));

      const matchesModule = moduleFilter === 'ALL' || log.sourceModule === moduleFilter;
      const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;

      return matchesSearch && matchesModule && matchesEntity;
    });
  }, [logs, searchQuery, moduleFilter, entityFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const handleDownloadCsv = () => {
    const csvContent = alertsAuditService.exportAuditLogsToCsv(filteredLogs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AuthenX_AICTE_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action: string) => {
    if (action.includes('RESOLV') || action.includes('COMPLET') || action.includes('ACCEPT')) {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">{action}</span>;
    }
    if (action.includes('ESCALAT') || action.includes('ANOMALY') || action.includes('FAIL')) {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">{action}</span>;
    }
    if (action.includes('RECTIF') || action.includes('ALERT') || action.includes('ASSIGN')) {
      return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">{action}</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">{action}</span>;
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
            placeholder="Search audit trail by actor, action, app ID, justification..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Filters and Export Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Module Filter */}
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value as 'ALL' | SourceModule);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Source Modules</option>
            <option value="HUMAN_REVIEW">Human Review</option>
            <option value="ANOMALY_DETECTION">Anomaly Detection</option>
            <option value="COMPLIANCE">Compliance Engine</option>
            <option value="ISSUING_AUTHORITY">Issuing Authority</option>
            <option value="DOCUMENT_VAULT">Document Vault</option>
            <option value="SECURITY">Security</option>
          </select>

          {/* Entity Type Filter */}
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Entity Types</option>
            <option value="APPLICATION">Applications</option>
            <option value="DOCUMENT">Documents</option>
            <option value="RECTIFICATION">Rectifications</option>
            <option value="ALERT">Alerts</option>
            <option value="COMPLIANCE_RULE">Rules</option>
          </select>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            title="Download CSV report with formula-injection protection"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit Log
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Timestamp (UTC) & ID</th>
              <th className="py-3 px-4">Actor & Role</th>
              <th className="py-3 px-4">Action Taken</th>
              <th className="py-3 px-4">Entity & Application</th>
              <th className="py-3 px-4">Change Summary & Values</th>
              <th className="py-3 px-4">Officer Justification</th>
              <th className="py-3 px-4">Module & IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <span>No audit entries match the selected filters.</span>
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Timestamp & ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{log.id}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{log.timestamp.replace('T', ' ').substring(0, 19)}</span>
                    </div>
                  </td>

                  {/* Actor & Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800 text-[11px]">{log.actorName}</div>
                    <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1 py-0.5 rounded mt-0.5 inline-block">
                      {log.role}
                    </span>
                  </td>

                  {/* Action Taken */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>

                  {/* Entity & Application */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 text-[11px]">{log.entityType}</span>
                    <div className="text-[10px] text-blue-600 font-medium">
                      {log.applicationId || log.entityId}
                    </div>
                  </td>

                  {/* Change Summary & Values */}
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <div className="text-slate-800 font-medium truncate" title={log.changeSummary}>
                      {log.changeSummary}
                    </div>
                    {log.newValue && (
                      <div className="text-[10px] text-emerald-700 font-mono mt-0.5 truncate" title={log.newValue}>
                        New: {log.newValue}
                      </div>
                    )}
                  </td>

                  {/* Officer Justification */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    {log.officerJustification ? (
                      <p className="text-[11px] text-slate-600 italic truncate" title={log.officerJustification}>
                        "{log.officerJustification}"
                      </p>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>

                  {/* Module & IP */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {log.sourceModule}
                    </span>
                    {log.ipAddress && (
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        IP: {log.ipAddress}
                      </div>
                    )}
                  </td>
                </tr>
              ))
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
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
