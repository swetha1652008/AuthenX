import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  X, 
  FileText, 
  Check 
} from 'lucide-react';
import type { ComplianceChecklistItem, ComplianceAssessment } from '../../types/compliance';

interface EvidenceComparisonWorkspaceProps {
  checklistItem: ComplianceChecklistItem;
  assessment: ComplianceAssessment;
  onClose: () => void;
  onRecordDecision: (outcome: 'APPROVED' | 'RECTIFICATION_REQUIRED' | 'FLAGGED_DEFICIENCY', notes: string) => void;
}

export const EvidenceComparisonWorkspace: React.FC<EvidenceComparisonWorkspaceProps> = ({
  checklistItem,
  assessment,
  onClose,
  onRecordDecision,
}) => {
  const [officerNotes, setOfficerNotes] = useState('');

  // Find linked evidence
  const linkedEvidence = assessment.evidence.filter((e) =>
    checklistItem.linkedEvidenceIds.includes(e.id)
  );

  const comparisonFields = [
    {
      field: 'Minimum Instructional Area',
      regulatoryNorm: 'APH 2026-27 Table 2.2: Min 12,500 m² for 564 approved student intake',
      submittedEvidence: 'Sanctioned Blueprint OC-2025/941: 14,800 m² carpet instructional area',
      status: 'MATCH',
      confidence: 96,
    },
    {
      field: 'Classroom Carpet Area',
      regulatoryNorm: 'Min 66.0 m² per division classroom with dual emergency egress',
      submittedEvidence: 'Rooms 101-112: 68.0 m² (8.5m x 8.0m) dimensioned in floor schedule',
      status: 'MATCH',
      confidence: 94,
    },
    {
      field: 'Departmental Laboratory Sizing',
      regulatoryNorm: 'Min 66.0 m² for Computer/IT lab; min 66 workstations capacity',
      submittedEvidence: 'AI Lab Room 204: 102.0 m²; photo CV confirmed 65 active desktop units',
      status: 'MATCH',
      confidence: 92,
    },
    {
      field: 'Barrier-Free Accessibility',
      regulatoryNorm: 'RPwD Act 2016: Ramp gradient <= 1:12 with continuous handrail and lift cues',
      submittedEvidence: 'Main entrance photo confirmed 1:12 ramp and tactile paving strips',
      status: 'MATCH',
      confidence: 91,
    },
    {
      field: 'Safety Clearance Validity',
      regulatoryNorm: 'State Fire NOC must be active through academic session 2026-2027',
      submittedEvidence: 'Karnataka Fire NOC #KFS-2024-NOC-8891 valid through 2027-12-01',
      status: 'MATCH',
      confidence: 98,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#102B4E]">
                  Regulatory vs Submitted Evidence Comparison Workspace
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded">
                  {checklistItem.requirementCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {checklistItem.ruleTitle}
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

        {/* Comparison Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Linked Evidence Chips */}
          <div className="flex items-center flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 text-xs">Linked Evidence Files:</span>
            {linkedEvidence.length > 0 ? (
              linkedEvidence.map((ev) => (
                <span
                  key={ev.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  {ev.title} (v{ev.versionNumber})
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">No evidence files linked to this requirement yet.</span>
            )}
          </div>

          {/* Two-Column Side-by-Side Comparison Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                  <th className="py-2.5 px-3 w-1/4">Regulatory Criterion</th>
                  <th className="py-2.5 px-3 w-1/3 text-blue-900 bg-blue-50/50">Authoritative AICTE Norm</th>
                  <th className="py-2.5 px-3 w-1/3 text-slate-900 bg-slate-50/50">Submitted Evidence Extraction</th>
                  <th className="py-2.5 px-3 text-right">Alignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {comparisonFields.map((field) => (
                  <tr key={field.field} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-800">{field.field}</td>
                    <td className="py-3 px-3 text-slate-700 bg-blue-50/20">{field.regulatoryNorm}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium bg-slate-50/20">{field.submittedEvidence}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" /> MATCH ({field.confidence}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Officer Decision Box */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
            <label className="block text-xs font-bold text-[#102B4E] mb-1">
              Officer Comparison Finding & Rationale:
            </label>
            <textarea
              rows={2}
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Enter audit rationale for checklist determination..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none mb-3 bg-white"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onRecordDecision('FLAGGED_DEFICIENCY', officerNotes || 'Deficiency confirmed from evidence comparison.')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
              >
                Flag Deficiency
              </button>

              <button
                type="button"
                onClick={() => onRecordDecision('RECTIFICATION_REQUIRED', officerNotes || 'Rectification needed for minor deviation.')}
                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
              >
                Rectification Required
              </button>

              <button
                type="button"
                onClick={() => onRecordDecision('APPROVED', officerNotes || 'Submitted evidence verified fully aligned with AICTE norms.')}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Compliance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
