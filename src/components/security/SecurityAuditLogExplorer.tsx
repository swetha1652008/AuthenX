import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SecurityAuditLog } from '../../types/securityAccess';

interface Props {
  logs: SecurityAuditLog[];
  onExportCsv: () => void;
}

export const SecurityAuditLogExplorer: React.FC<Props> = ({ logs, onExportCsv }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.correlationId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchOutcome = outcomeFilter === 'ALL' || l.outcome === outcomeFilter;
      return matchSearch && matchOutcome;
    });
  }, [logs, searchTerm, outcomeFilter]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getOutcomeBadge = (outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED') => {
    switch (outcome) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FAILURE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'BLOCKED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header and Filters */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, resource, IP, or correlation ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={outcomeFilter}
            onChange={(e) => {
              setOutcomeFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Audit Outcome"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Event Outcomes</option>
            <option value="SUCCESS">Success Events</option>
            <option value="FAILURE">Failed Attempts</option>
            <option value="BLOCKED">Blocked Operations</option>
          </select>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export Audit CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Timestamp & Trace ID</th>
              <th className="py-3 px-3">Actor & Role</th>
              <th className="py-3 px-3">Action & Target Resource</th>
              <th className="py-3 px-3">Module</th>
              <th className="py-3 px-3">Outcome</th>
              <th className="py-3 px-4">Client IP & Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
            {paginatedLogs.map((log: SecurityAuditLog) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="text-slate-700 font-semibold">{log.timestamp}</div>
                  <div className="text-[10px] text-slate-400">{log.correlationId}</div>
                </td>

                <td className="py-3 px-3">
                  <div className="font-bold text-[#102B4E] font-sans">{log.actor}</div>
                  <div className="text-[10px] text-slate-500 font-sans">{log.actorRole.replace(/_/g, ' ')}</div>
                </td>

                <td className="py-3 px-3 max-w-xs font-sans">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {log.action}
                  </span>
                  <div className="text-[11px] text-slate-700 mt-1 line-clamp-1">{log.targetResource}</div>
                </td>

                <td className="py-3 px-3 font-sans">
                  <span className="text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {log.module}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getOutcomeBadge(log.outcome)}`}>
                    {log.outcome}
                  </span>
                </td>

                <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                  <div className="font-mono text-[10px] text-slate-600">{log.sourceIp}</div>
                  {log.reason && (
                    <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                      {log.reason}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-sans">
        <div>
          Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, filteredLogs.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredLogs.length}</span> audit records
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p: number) => p - 1)}
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
            onClick={() => setCurrentPage((p: number) => p + 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
