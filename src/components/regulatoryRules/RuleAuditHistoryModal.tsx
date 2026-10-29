import React from 'react';
import { X, ShieldAlert, Clock, UserCheck } from 'lucide-react';
import type { RegulatoryRuleItem } from '../../types/regulatoryRules';
import { regulatoryRulesService } from '../../services/regulatoryRulesService';

interface Props {
  rule: RegulatoryRuleItem;
  onClose: () => void;
}

export const RuleAuditHistoryModal: React.FC<Props> = ({ rule, onClose }) => {
  const allLogs = regulatoryRulesService.getAuditLogs();
  const ruleLogs = allLogs.filter(
    (l) => l.ruleId === rule.id || l.ruleCode === rule.requirementCode
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scale-in max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-500/10 text-slate-700 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Statutory Audit Trail: {rule.requirementCode}
              </h3>
              <p className="text-xs text-slate-500">
                Immutable chronological log of rule creation, review, and publication events
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 text-xs text-slate-700">
          {ruleLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No specific audit entries logged yet</p>
              <p className="text-[11px] text-slate-400">
                Action triggers when you submit, approve, or publish changes to this rule.
              </p>
            </div>
          ) : (
            ruleLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {log.details}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <UserCheck className="w-3 h-3 text-slate-400" />
                    <span>Actor: {log.actor} ({log.role})</span>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-slate-400 shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
