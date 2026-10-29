import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  X, 
  FileCheck, 
  Save 
} from 'lucide-react';
import type { 
  ComplianceChecklistItem, 
  ComplianceAssessment, 
  OfficerAssessmentResult 
} from '../../types/compliance';

interface OfficerAssessmentModalProps {
  item: ComplianceChecklistItem;
  assessment: ComplianceAssessment;
  onClose: () => void;
  onSaveAssessment: (itemId: string, outcome: OfficerAssessmentResult, notes: string) => void;
}

export const OfficerAssessmentModal: React.FC<OfficerAssessmentModalProps> = ({
  item,
  assessment,
  onClose,
  onSaveAssessment,
}) => {
  const [outcome, setOutcome] = useState<OfficerAssessmentResult>(
    item.officerResult !== 'UNASSESSED' ? item.officerResult : 'APPROVED'
  );
  const [notes, setNotes] = useState(item.reviewerNotes || '');

  const linkedEvidence = assessment.evidence.filter((e) =>
    item.linkedEvidenceIds.includes(e.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAssessment(item.id, outcome, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#102B4E]">
                  Record Compliance Officer Assessment
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded">
                  {item.requirementCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AICTE Scrutiny Dossier: {assessment.applicationReference}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Requirement Info */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 text-xs">{item.ruleTitle}</p>
            <p className="text-[11px] text-slate-500">{item.regulatorySource}</p>
          </div>

          {/* Evidence Summary */}
          <div>
            <span className="block font-bold text-slate-700 mb-1">
              Attached Evidence ({linkedEvidence.length}):
            </span>
            {linkedEvidence.length > 0 ? (
              <div className="space-y-1.5">
                {linkedEvidence.map((ev) => (
                  <div key={ev.id} className="p-2 bg-blue-50/40 border border-blue-100 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{ev.title}</span>
                      <span className="text-[10px] text-slate-500 block">v{ev.versionNumber} • {ev.fileSize} • {ev.reviewStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 italic">
                No evidence file attached yet.
              </div>
            )}
          </div>

          {/* Determination Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Official Determination Outcome:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutcome('APPROVED')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  outcome === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-100'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">Approved</span>
                  <span className="text-[10px] text-slate-500">Fully compliant with norms</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('RECTIFICATION_REQUIRED')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  outcome === 'RECTIFICATION_REQUIRED'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-100'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">Rectification Req.</span>
                  <span className="text-[10px] text-slate-500">Minor deviation noted</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('FLAGGED_DEFICIENCY')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  outcome === 'FLAGGED_DEFICIENCY'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-100'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">Flag Deficiency</span>
                  <span className="text-[10px] text-slate-500">Non-compliant finding</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('INSPECTION_RECOMMENDED')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  outcome === 'INSPECTION_RECOMMENDED'
                    ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-100'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">Inspection Rec.</span>
                  <span className="text-[10px] text-slate-500">Physical on-site review</span>
                </div>
              </button>
            </div>
          </div>

          {/* Observations Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Official Review Observations & Order Notes:
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record mandatory scrutiny justification..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Determination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
