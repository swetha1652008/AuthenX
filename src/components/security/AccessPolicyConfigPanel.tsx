import React, { useState } from 'react';
import { Sliders, Save, CheckCircle } from 'lucide-react';
import type { SecurityAccessPolicy } from '../../types/securityAccess';

interface Props {
  policies: SecurityAccessPolicy[];
  onUpdatePolicy: (id: string, value: string | number | boolean) => void;
}

export const AccessPolicyConfigPanel: React.FC<Props> = ({
  policies,
  onUpdatePolicy,
}) => {
  const [editingValues, setEditingValues] = useState<Record<string, string | number | boolean>>(() => {
    const init: Record<string, string | number | boolean> = {};
    policies.forEach((p) => {
      init[p.id] = p.currentValue;
    });
    return init;
  });

  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = (policyId: string) => {
    const val = editingValues[policyId];
    onUpdatePolicy(policyId, val);
    setSavedId(policyId);
    setTimeout(() => setSavedId(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#0F766E]" />
          Platform Security & Session Access Policies
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Server-enforced authentication security parameters, brute-force lockout rules, and session lifecycle controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy) => {
          const currentVal = editingValues[policy.id] ?? policy.currentValue;
          const isBoolean = typeof policy.defaultValue === 'boolean';
          const isSaved = savedId === policy.id;

          return (
            <div
              key={policy.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                    {policy.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    policy.securityImpact === 'HIGH'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {policy.securityImpact} IMPACT
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs mt-1">{policy.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {policy.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3">
                <div className="flex-1">
                  {isBoolean ? (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(currentVal)}
                        onChange={(e) =>
                          setEditingValues({
                            ...editingValues,
                            [policy.id]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-[#0F766E] rounded border-slate-300"
                      />
                      <span>{currentVal ? 'Enforced Platform-wide' : 'Optional / Disabled'}</span>
                    </label>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={Number(currentVal)}
                        onChange={(e) =>
                          setEditingValues({
                            ...editingValues,
                            [policy.id]: Number(e.target.value),
                          })
                        }
                        className="w-20 px-2 py-1 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                      />
                      {policy.unit && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {policy.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSave(policy.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0F766E] hover:bg-[#115e59] text-white'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Enforced
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Update
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
