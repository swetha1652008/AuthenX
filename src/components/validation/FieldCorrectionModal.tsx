import React, { useState } from 'react';
import { X, Edit3, ShieldCheck } from 'lucide-react';
import type { ExtractedFieldItem } from '../../types/document';

interface FieldCorrectionModalProps {
  field: ExtractedFieldItem | null;
  onClose: () => void;
  onSubmitCorrection: (fieldKey: string, newValue: string) => void;
}

export const FieldCorrectionModal: React.FC<FieldCorrectionModalProps> = ({
  field,
  onClose,
  onSubmitCorrection,
}) => {
  const [correctedValue, setCorrectedValue] = useState(field?.extractedValue || '');

  if (!field) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (correctedValue.trim()) {
      onSubmitCorrection(field.fieldKey, correctedValue.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#102B4E]">Correct Extracted Value</h4>
              <p className="text-[11px] text-slate-500">Statutory attribute correction override</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Field Attribute
            </label>
            <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900">
              {field.fieldName}
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              OCR Original Reading
            </label>
            <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-600">
              {field.extractedValue}
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
              Corrected / Canonical Value:
            </label>
            <input
              type="text"
              value={correctedValue}
              onChange={(e) => setCorrectedValue(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CFE2FE] bg-white focus:ring-2 focus:ring-[#2563EB]/20 text-slate-900 font-semibold"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span>This correction will be permanently logged in the audit trail with your user identifier and timestamp.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer transition-colors shadow-sm"
            >
              Apply Correction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
