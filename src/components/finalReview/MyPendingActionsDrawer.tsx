import { X, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ScrutinyApplicationSummary } from '../../types/finalReview';

interface Props {
  applications: ScrutinyApplicationSummary[];
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspace: (appId: string) => void;
}

export const MyPendingActionsDrawer: React.FC<Props> = ({
  applications,
  isOpen,
  onClose,
  onOpenWorkspace,
}) => {
  if (!isOpen) return null;

  const pendingApps = applications.filter((a) => a.pendingActionType !== 'None');

  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-[#102B4E]">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-bold text-sm">My Pending Scrutiny Tasks</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
          {pendingApps.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700">All Action Items Clear</p>
              <p className="text-[11px] text-slate-400">No overdue clarifications or unassigned reviews.</p>
            </div>
          ) : (
            pendingApps.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#102B4E]">
                    {app.applicationRef}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {app.pendingActionType}
                  </span>
                </div>

                <div className="text-slate-800 font-semibold line-clamp-1">{app.institutionName}</div>
                <div className="text-[10px] text-slate-400">
                  Completeness: {app.completenessScore}% • Assigned: {app.assignedOfficer}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenWorkspace(app.id);
                      onClose();
                    }}
                    className="text-[#2563EB] hover:text-[#1d4ed8] font-bold text-xs flex items-center gap-1"
                  >
                    Scrutinize Application <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
