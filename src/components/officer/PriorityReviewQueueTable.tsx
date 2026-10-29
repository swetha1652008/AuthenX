import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  Eye, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import type { PriorityQueueItem, QueuePriority } from '../../types/officerDashboard';

interface PriorityReviewQueueTableProps {
  queueItems: PriorityQueueItem[];
  onOpenApplication: (appId: string) => void;
  onReviewApplication: (appId: string) => void;
}

export const PriorityReviewQueueTable: React.FC<PriorityReviewQueueTableProps> = ({
  queueItems,
  onOpenApplication,
  onReviewApplication,
}) => {
  const getPriorityBadge = (priority: QueuePriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3 h-3 text-rose-600" /> Critical
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" /> Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
            Low
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-sm font-bold text-[#102B4E]">
              Priority Scrutiny Review Queue
            </h3>
            <p className="text-[11px] text-slate-500">
              Urgent cases prioritized by discrepancy severity, faculty deficits, and inspection escalations.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
          {queueItems.length} Cases Requiring Scrutiny
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-3">Application Ref</th>
              <th className="py-2.5 px-3">Institution Name</th>
              <th className="py-2.5 px-3">Primary Issue / Deficit</th>
              <th className="py-2.5 px-2 text-center">Priority</th>
              <th className="py-2.5 px-2 text-center">Status</th>
              <th className="py-2.5 px-3">Last Updated</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {queueItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition">
                {/* Application ID */}
                <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">
                  {item.applicationId}
                  <span className="block text-[10px] font-sans font-medium text-slate-400">
                    {item.applicationType === 'EOA' ? 'Extension of Approval' : 'Approval Changes'}
                  </span>
                </td>

                {/* Institution */}
                <td className="py-3 px-3 max-w-[200px]">
                  <span className="font-bold text-slate-900 line-clamp-1 block" title={item.institutionName}>
                    {item.institutionName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {item.institutionId}
                  </span>
                </td>

                {/* Issue */}
                <td className="py-3 px-3 max-w-xs">
                  <p className="font-medium text-slate-800 line-clamp-2" title={item.issue}>
                    {item.issue}
                  </p>
                  {item.unresolvedCount > 0 && (
                    <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                      • {item.unresolvedCount} open compliance gap(s)
                    </span>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3 px-2 text-center">
                  {getPriorityBadge(item.priority)}
                </td>

                {/* Status */}
                <td className="py-3 px-2 text-center">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {item.currentStatus}
                  </span>
                </td>

                {/* Last Updated */}
                <td className="py-3 px-3 text-[11px] text-slate-500 font-mono">
                  {item.lastUpdated}
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenApplication(item.applicationId)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onReviewApplication(item.applicationId)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md transition shadow-2xs flex items-center gap-1"
                      title="Review Case"
                    >
                      Review
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {queueItems.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-xs">
          No urgent applications in priority review queue.
        </div>
      )}
    </div>
  );
};
