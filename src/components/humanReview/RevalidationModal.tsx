import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import type { RevalidationRun } from '../../types/humanReview';

interface RevalidationModalProps {
  applicationId: string;
  institutionName: string;
  onExecute: () => RevalidationRun;
  onClose: () => void;
}

export const RevalidationModal: React.FC<RevalidationModalProps> = ({
  applicationId,
  institutionName,
  onExecute,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedRun, setCompletedRun] = useState<RevalidationRun | null>(null);

  const steps = [
    'Verifying Updated Document SHA-256 Checksum & Authenticity Integrity...',
    'Validating Digital Signatures (PKI Chain & OCSP Status)...',
    'Executing OCR Field Alignment against Mandated AICTE Clauses...',
    'Re-checking Institution Capacity & Cadre Ratios in Rule Engine...',
    'Synthesizing Re-validation Assessment & Final Score...'
  ];

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        const result = onExecute();
        setCompletedRun(result);
        setIsRunning(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, steps.length, onExecute]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Automated AI Re-validation</h3>
              <p className="text-[11px] text-slate-500">
                {institutionName} ({applicationId})
              </p>
            </div>
          </div>
          {!isRunning && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress or Completion */}
        {isRunning ? (
          <div className="space-y-4 py-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="space-y-2">
              {steps.map((st, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={st}
                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-indigo-50/80 text-indigo-900 font-semibold'
                        : isDone
                        ? 'text-slate-500 font-medium'
                        : 'text-slate-300'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                    <span className="text-[11px]">{st}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          completedRun && (
            <div className="space-y-4 animate-fade-in">
              {/* Success Badge */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-xs">
                    Re-validation Run {completedRun.id} Passed
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {completedRun.summary}
                  </p>
                </div>
              </div>

              {/* Before/After Score Comparison */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Previous Score</span>
                  <span className="text-xl font-bold text-slate-600">{completedRun.previousScore}%</span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" /> New Score
                  </span>
                  <span className="text-xl font-black text-indigo-600">{completedRun.newScore}%</span>
                </div>
              </div>

              {/* Cleared Findings */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Findings Cleared:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    +{completedRun.findingsCleared} Resolved
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Remaining Flagged Items:</span>
                  <span>{completedRun.findingsRemaining} item(s)</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-xs"
                >
                  Return to Workspace
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
