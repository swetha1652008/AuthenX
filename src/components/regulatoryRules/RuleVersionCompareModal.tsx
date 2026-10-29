import React from 'react';
import { X, GitCompare, History, CheckCircle2 } from 'lucide-react';
import type { RegulatoryRuleItem } from '../../types/regulatoryRules';

interface Props {
  rule: RegulatoryRuleItem;
  onClose: () => void;
}

export const RuleVersionCompareModal: React.FC<Props> = ({ rule, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-scale-in max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Version Diff & Precedents: {rule.requirementCode}
              </h3>
              <p className="text-xs text-slate-500">
                Traceability and historical evolution across academic years
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Active Version vs Previous */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                  Active Published Specification
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                  {rule.version}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{rule.title}</h4>
              <p className="text-slate-600 text-[11px] mb-3">{rule.description}</p>
              
              <div className="space-y-1.5 border-t border-emerald-100 pt-2 text-[11px]">
                <div><strong>Category:</strong> {rule.category}</div>
                <div><strong>Scope:</strong> {rule.applicationCategory}</div>
                <div><strong>Clause:</strong> {rule.regulatoryReference.aicteClause}</div>
                <div><strong>Publisher:</strong> {rule.publisher || 'Council Headquarters'}</div>
                <div><strong>Effective From:</strong> {rule.effectiveFrom}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Prior Version Precedent
                </span>
                <span className="font-mono text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-200 border border-slate-300">
                  v2025.0 (Archived)
                </span>
              </div>
              <h4 className="font-bold text-slate-700 mb-1">{rule.title} (AY 2025-26)</h4>
              <p className="text-slate-500 text-[11px] mb-3">
                Pre-amendment statutory baseline codified prior to Approval Process Handbook AY 2026-27 update.
              </p>
              
              <div className="space-y-1.5 border-t border-slate-200 pt-2 text-[11px] text-slate-600">
                <div><strong>Category:</strong> {rule.category}</div>
                <div><strong>Scope:</strong> {rule.applicationCategory}</div>
                <div><strong>Status:</strong> SUPERSEDED</div>
                <div><strong>Superseded At:</strong> {rule.effectiveFrom}</div>
              </div>
            </div>
          </div>

          {/* Historical Modification Timeline */}
          <div>
            <h4 className="text-xs font-bold text-[#102B4E] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-purple-600" /> Version Changelog & Editorial Actions
            </h4>
            <div className="space-y-3">
              {rule.history && rule.history.length > 0 ? (
                rule.history.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800 text-[11px]">
                          {h.version}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {h.changedAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{h.changeSummary}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Author / Officer: <span className="font-medium text-slate-600">{h.changedBy}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No previous versions on record.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
