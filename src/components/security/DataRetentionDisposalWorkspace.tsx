import React, { useState } from 'react';
import { 
  Archive, 
  Trash2, 
  Lock, 
  Unlock, 
  AlertTriangle 
} from 'lucide-react';
import type { DataRetentionPolicy } from '../../types/securityAccess';

interface Props {
  policies: DataRetentionPolicy[];
  onToggleLegalHold: (policyId: string, active: boolean) => void;
  onSimulateDisposal: (policyId: string) => void;
}

export const DataRetentionDisposalWorkspace: React.FC<Props> = ({
  policies,
  onToggleLegalHold,
  onSimulateDisposal,
}) => {
  const [confirmDisposalTarget, setConfirmDisposalTarget] = useState<DataRetentionPolicy | null>(null);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
          <Archive className="w-5 h-5 text-[#0F766E]" />
          Statutory Data Retention & Controlled Disposal Lifecycle
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Public Records Act 1993, IT Act Section 67C, and DPDP 2023 compliance governance.
        </p>
      </div>

      <div className="space-y-4">
        {policies.map((p) => {
          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition-all ${
                p.legalHoldActive
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#102B4E]">
                      {p.dataCategory.replace(/_/g, ' ')}
                    </span>
                    {p.legalHoldActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        <Lock className="w-3 h-3" /> Legal Hold Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Unlock className="w-3 h-3" /> Standard Lifecycle
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{p.purpose}</p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Statutory Source: <span className="text-slate-600 font-semibold">{p.legalReference}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-black text-[#102B4E]">
                      {p.retentionDurationDays} Days
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Eligible: {p.eligibleRecordCount} records
                    </div>
                  </div>

                  {/* Legal Hold Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleLegalHold(p.id, !p.legalHoldActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                      p.legalHoldActive
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p.legalHoldActive ? 'Release Hold' : 'Apply Legal Hold'}
                  </button>

                  {/* Disposal Button */}
                  <button
                    type="button"
                    disabled={p.eligibleRecordCount === 0 || p.legalHoldActive}
                    onClick={() => setConfirmDisposalTarget(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-40 disabled:hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Purge Expired
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmDisposalTarget && (
        <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#102B4E]">
                Confirm Statutory Data Disposal
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to execute <strong>{confirmDisposalTarget.disposalMethod}</strong> on{' '}
              <strong>{confirmDisposalTarget.eligibleRecordCount} records</strong> in category{' '}
              <span className="font-mono font-bold text-slate-800">{confirmDisposalTarget.dataCategory}</span>.
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] space-y-1">
              <p className="font-bold">Irreversible Administrative Operation:</p>
              <p>This action will be appended to CERT-In audit logs with your digital identity signature.</p>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setConfirmDisposalTarget(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSimulateDisposal(confirmDisposalTarget.id);
                  setConfirmDisposalTarget(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Authorize Disposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
