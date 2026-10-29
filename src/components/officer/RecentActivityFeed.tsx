import React from 'react';
import { History } from 'lucide-react';
import type { RecentActivityItem } from '../../types/officerDashboard';

interface RecentActivityFeedProps {
  activities: RecentActivityItem[];
  onOpenApplication: (appId: string) => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  onOpenApplication,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-[#102B4E]">
              Recent Application Scrutiny Activity
            </h3>
            <p className="text-[11px] text-slate-500">
              Live audit stream of application submissions, AI document checks, and officer reviews.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-500">
          Last 10 Events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-3">Application Ref</th>
              <th className="py-2.5 px-3">Institution</th>
              <th className="py-2.5 px-3">Action Description</th>
              <th className="py-2.5 px-3">Actor / Authority</th>
              <th className="py-2.5 px-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map((act) => (
              <tr
                key={act.id + act.timestamp}
                onClick={() => onOpenApplication(act.applicationId)}
                className="hover:bg-blue-50/40 cursor-pointer transition"
              >
                <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">
                  {act.applicationId}
                </td>

                <td className="py-3 px-3 max-w-[180px] truncate font-medium text-slate-900" title={act.institutionName}>
                  {act.institutionName}
                </td>

                <td className="py-3 px-3 max-w-sm">
                  <p className="text-slate-800 font-semibold line-clamp-1">{act.latestAction}</p>
                  <span className="text-[10px] text-slate-400 block">
                    Type: {act.applicationType} • Status: {act.validationStatus}
                  </span>
                </td>

                <td className="py-3 px-3 text-slate-600 text-[11px] font-medium">
                  {act.actor}
                </td>

                <td className="py-3 px-3 text-right text-[11px] font-mono text-slate-500">
                  {act.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-6 text-slate-500 text-xs">
          No recent activity events recorded.
        </div>
      )}
    </div>
  );
};
