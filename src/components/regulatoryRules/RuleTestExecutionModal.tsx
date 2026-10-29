import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Code2, 
  Info,
  RotateCcw
} from 'lucide-react';
import type { RegulatoryRuleItem, RuleTestCase } from '../../types/regulatoryRules';
import { regulatoryRulesService } from '../../services/regulatoryRulesService';

interface Props {
  rule: RegulatoryRuleItem;
  onClose: () => void;
}

export const RuleTestExecutionModal: React.FC<Props> = ({ rule, onClose }) => {
  const existingTests = regulatoryRulesService.getRuleTestCases(rule.id);
  
  // Default payload based on rule conditions
  const defaultPayload: Record<string, unknown> = {};
  rule.conditions.forEach((c) => {
    defaultPayload[c.field] = c.value ?? 'SampleValue';
  });

  const [inputPayloadJson, setInputPayloadJson] = useState(
    JSON.stringify(defaultPayload, null, 2)
  );

  const [testResult, setTestResult] = useState<{
    outcome: 'PASS' | 'FAIL' | 'MANUAL_REVIEW';
    evaluatedNotes: string;
    executedAt: string;
  } | null>(null);

  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSelectPresetTest = (tc: RuleTestCase) => {
    setInputPayloadJson(JSON.stringify(tc.inputPayload, null, 2));
    setTestResult(null);
    setJsonError(null);
  };

  const handleExecuteSimulation = () => {
    setJsonError(null);
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(inputPayloadJson);
    } catch (err: unknown) {
      setJsonError('Invalid JSON format in synthetic input payload.');
      return;
    }

    const res = regulatoryRulesService.runRuleTest(rule.id, parsed);
    setTestResult({
      outcome: res.outcome,
      evaluatedNotes: res.evaluatedNotes,
      executedAt: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Simulate Rule Engine: {rule.requirementCode}
              </h3>
              <p className="text-xs text-slate-500">
                Sandboxed Synthetic Scrutiny Simulator ({rule.version})
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

        {/* Warning Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-amber-800 text-[11px] font-medium">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Synthetic Simulation Run:</strong> Executed in safe preview mode.
            Draft modifications do not affect real institutional submissions or council decisions.
          </span>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Preset Test Cases if available */}
          {existingTests.length > 0 && (
            <div>
              <label className="block font-bold text-slate-600 uppercase text-[10px] tracking-wider mb-1.5">
                Pre-Configured Test Cases
              </label>
              <div className="flex flex-wrap gap-2">
                {existingTests.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectPresetTest(t)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-[11px] font-medium transition-colors"
                  >
                    {t.testCaseName} ({t.expectedOutcome})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rule Conditions Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block">
              Active Evaluation Conditions
            </span>
            <div className="space-y-1">
              {rule.conditions.map((c, i) => (
                <div key={i} className="font-mono text-[11px] text-slate-700 flex items-center gap-1.5">
                  <span className="text-[#2563EB] font-semibold">{c.field}</span>
                  <span className="text-slate-400">{c.operator}</span>
                  <span className="text-emerald-700 font-semibold">{String(c.value ?? 'Non-Empty')}</span>
                  {c.unit && <span className="text-slate-400">({c.unit})</span>}
                </div>
              ))}
            </div>
          </div>

          {/* JSON Payload Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Synthetic Input Payload (JSON)
              </label>
              <button
                type="button"
                onClick={() => setInputPayloadJson(JSON.stringify(defaultPayload, null, 2))}
                className="text-[10px] text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Sample
              </button>
            </div>
            <textarea
              rows={6}
              value={inputPayloadJson}
              onChange={(e) => setInputPayloadJson(e.target.value)}
              className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {jsonError && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1">{jsonError}</p>
            )}
          </div>

          {/* Simulation Output Area */}
          {testResult && (
            <div className={`p-4 rounded-xl border transition-all ${
              testResult.outcome === 'PASS'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : testResult.outcome === 'FAIL'
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {testResult.outcome === 'PASS' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {testResult.outcome === 'FAIL' && (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  {testResult.outcome === 'MANUAL_REVIEW' && (
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <span className="font-black text-sm uppercase tracking-wide">
                    Verdict: {testResult.outcome}
                  </span>
                </div>
                <span className="text-[10px] font-mono opacity-70">
                  Executed at {testResult.executedAt}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-mono">
                {testResult.evaluatedNotes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 font-semibold"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleExecuteSimulation}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm shadow-blue-500/20"
          >
            <Play className="w-4 h-4 fill-white" /> Execute Rule Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
