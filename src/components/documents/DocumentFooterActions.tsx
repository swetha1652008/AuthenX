import React from 'react';
import { 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DocumentFooterActionsProps {
  onBackToApplication: () => void;
  onSaveProgress: () => void;
  onValidateDocuments: () => void;
  onContinueToValidation: () => void;
  isSaving?: boolean;
  isValidating?: boolean;
}

export const DocumentFooterActions: React.FC<DocumentFooterActionsProps> = ({
  onBackToApplication,
  onSaveProgress,
  onValidateDocuments,
  onContinueToValidation,
  isSaving = false,
  isValidating = false,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#CFE2FE] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left Back Button */}
      <button
        type="button"
        onClick={onBackToApplication}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500" />
        <span>Back to Application</span>
      </button>

      {/* Right Primary Actions */}
      <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onSaveProgress}
          disabled={isSaving}
          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#CFE2FE] bg-white hover:bg-[#EAF2FF] text-[#2563EB] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
        </button>

        <button
          type="button"
          onClick={onValidateDocuments}
          disabled={isValidating}
          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isValidating ? 'Validating...' : 'Validate Documents'}</span>
        </button>

        <button
          type="button"
          onClick={onContinueToValidation}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Continue to AI Validation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
