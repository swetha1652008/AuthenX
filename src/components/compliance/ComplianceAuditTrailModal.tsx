import React from 'react';
import { 
  History, 
  X, 
  User, 
  Clock, 
  Tag
} from 'lucide-react';
import type { ComplianceAuditLog } from '../../types/compliance';

interface ComplianceAuditTrailModalProps {
  logs: ComplianceAuditLog[];
  applicationReference: string;
  onClose: () => void;
}

export const ComplianceAuditTrailModal: React.FC<ComplianceAuditTrailModalProps> = ({
  logs,
  applicationReference,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Compliance Assessment Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Immutable event record for application: <span className="font-mono text-slate-700">{applicationReference}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Timeline */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {logs && logs.length > 0 ? (
            <div className="relative border-l-2 border-blue-200 ml-3 space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  {/* Dot */}
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#2563EB] ring-4 ring-blue-50" />

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-slate-600 flex-wrap gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {log.eventType}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {log.createdAt}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-xs">
                      {log.reason || 'Event recorded in statutory compliance log.'}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-slate-400" /> {log.actorName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Tag className="w-3 h-3 text-slate-400" /> {log.entityType}: {log.entityId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No audit logs recorded for this assessment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
