import React from 'react';
import { 
  Download, 
  Printer, 
  Building2, 
  Calendar 
} from 'lucide-react';
import type { PendingActionReportItem } from '../../types/reportsAnalytics';

interface Report4PendingActionsProps {
  items: PendingActionReportItem[];
  onExportCsv: () => void;
  onOpenPrintPreview: () => void;
}

export const Report4PendingActions: React.FC<Report4PendingActionsProps> = ({
  items,
  onExportCsv,
  onOpenPrintPreview,
}) => {
  const getEscalationBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL_SHOW_CAUSE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">SHOW-CAUSE ESCALATION</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">WARNING STAGE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">STANDARD TRACKING</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Header & Export Actions */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
              Statutory Report 04
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Pending-Action & Overdue Scrutiny Tracking Report
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Active tracking of pending institution responses, overdue rectification notices, and escalation levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            type="button"
            onClick={onOpenPrintPreview}
            className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Printable PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Application & Institution</th>
              <th className="py-3 px-4">Pending Action Description</th>
              <th className="py-3 px-4">Days Outstanding</th>
              <th className="py-3 px-4">Deadline & Status</th>
              <th className="py-3 px-4">Responsible Party</th>
              <th className="py-3 px-4">Escalation Stage</th>
              <th className="py-3 px-4 text-right">Recommended Remedy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-[#102B4E]">{item.applicationId}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{item.institutionName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">ID: {item.institutionId}</div>
                </td>

                <td className="py-3.5 px-4 max-w-[240px]">
                  <div className="font-semibold text-slate-900 text-[11px] leading-relaxed">
                    {item.pendingActionType}
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`text-sm font-black ${item.daysOutstanding > 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {item.daysOutstanding} Days
                  </span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className={`flex items-center gap-1 font-semibold ${item.isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.dueDate}</span>
                  </div>
                  {item.isOverdue && (
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">
                      Overdue
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-[11px] text-slate-800 font-medium">
                    {item.responsibleParty}
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getEscalationBadge(item.escalationLevel)}
                </td>

                <td className="py-3.5 px-4 text-right max-w-[200px]">
                  <span className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {item.recommendedRemedy}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
