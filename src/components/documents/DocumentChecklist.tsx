import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Upload, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import type { ChecklistRequirement, DocumentCategory } from '../../types/document';

interface DocumentChecklistProps {
  checklist: ChecklistRequirement[];
  onUploadCategory: (category: DocumentCategory) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  checklist,
  onUploadCategory,
}) => {
  const mandatoryRules = checklist.filter((r) => r.isMandatory);
  const satisfiedMandatory = mandatoryRules.filter((r) => r.isSatisfied).length;
  const percentage = Math.round((satisfiedMandatory / (mandatoryRules.length || 1)) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#CFE2FE] shadow-card space-y-5">
      {/* Checklist Header & Progress Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="text-base font-extrabold text-[#102B4E] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              AICTE Regulatory Document Completeness Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Approval Process Handbook (APH) 2026-27 Normative Verification
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-[#102B4E]">
              {satisfiedMandatory} of {mandatoryRules.length}
            </span>
            <span className="text-xs text-slate-500 ml-1">Mandatory Categories Satisfied</span>
          </div>
        </div>

        {/* Visual Progress Track */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage === 100
                  ? 'bg-emerald-500'
                  : percentage >= 70
                  ? 'bg-[#2563EB]'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>Overall Completeness: {percentage}%</span>
            <span>
              {percentage === 100 ? (
                <span className="text-emerald-600 font-bold">Ready for AI Validation</span>
              ) : (
                <span className="text-amber-600 font-bold">
                  {mandatoryRules.length - satisfiedMandatory} Category Gaps Remaining
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 10 Categories Accordion / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {checklist.map((rule) => {
          const isSatisfied = rule.isSatisfied;
          const hasExpired = rule.uploadedCount > 0 && rule.validCount === 0;

          return (
            <div
              key={rule.category}
              className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                isSatisfied
                  ? 'bg-[#F8FAFC] border-emerald-200/80 hover:border-emerald-300'
                  : hasExpired
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  : rule.isMandatory
                  ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {isSatisfied ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : hasExpired ? (
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  ) : rule.isMandatory ? (
                    <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Info className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 truncate">{rule.title}</span>
                    {rule.isMandatory ? (
                      <span className="text-[9px] uppercase font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {rule.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="font-semibold text-slate-600">
                      Uploaded: {rule.uploadedCount}
                    </span>
                    <span>•</span>
                    <span className={isSatisfied ? 'text-emerald-700 font-bold' : hasExpired ? 'text-amber-700 font-bold' : 'text-rose-600 font-bold'}>
                      {rule.statusNotes}
                    </span>
                  </div>
                </div>
              </div>

              {!isSatisfied && (
                <button
                  type="button"
                  onClick={() => onUploadCategory(rule.category)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#CFE2FE] hover:border-[#2563EB] text-[11px] font-bold shrink-0 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                  title={`Upload document for ${rule.category}`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
