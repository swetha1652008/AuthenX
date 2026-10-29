import React, { useState } from 'react';
import { 
  Compass, 
  X, 
  Building2, 
  ShieldAlert 
} from 'lucide-react';
import type { 
  InspectionRecommendation, 
  ComplianceChecklistItem, 
  ComplianceFinding 
} from '../../types/compliance';

interface InspectionRecommendationModalProps {
  checklistItem?: ComplianceChecklistItem;
  finding?: ComplianceFinding;
  applicationReference: string;
  institutionName: string;
  onClose: () => void;
  onRecommendInspection: (recData: Omit<InspectionRecommendation, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const InspectionRecommendationModal: React.FC<InspectionRecommendationModalProps> = ({
  checklistItem,
  finding,
  applicationReference,
  institutionName,
  onClose,
  onRecommendInspection,
}) => {
  const [recommendationReason, setRecommendationReason] = useState(
    finding?.explanation ||
      'Photographs and architectural floor plans exhibit carpet area ambiguities that require physical verification by an Expert Visit Committee (EVC).'
  );
  const [supportingEvidence, setSupportingEvidence] = useState(
    finding?.evidenceReference || 'Master Campus Blueprint Sheet 2 & Computer Lab Photo'
  );
  const [decisionNotes, setDecisionNotes] = useState(
    'Recommend scheduling on-site physical scrutiny visit under AICTE Approval Process Handbook (APH 2026-27) norms.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecommendInspection({
      assessmentId: checklistItem?.assessmentId || 'asm_default',
      applicationReference,
      institutionId: '1-938210941',
      institutionName,
      relatedRequirementId: checklistItem?.ruleId || 'rule_aph_lab_03',
      relatedFindingId: finding?.id,
      recommendationReason,
      supportingEvidence,
      status: 'INSPECTION_RECOMMENDED',
      recommendedBy: 'Smt. Priya Sharma (Compliance Officer)',
      recommendedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      assignedOfficer: 'Smt. Priya Sharma (AICTE Scrutiny Officer)',
      decisionNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Recommend Physical On-Site Inspection
              </h3>
              <p className="text-xs text-slate-500">
                Application: <span className="font-mono text-slate-700">{applicationReference}</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-lg text-purple-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <span className="font-bold block">{institutionName}</span>
              <span className="text-[11px] text-purple-700">Dossier: {applicationReference}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Inspection Justification Reason:
            </label>
            <textarea
              rows={3}
              required
              value={recommendationReason}
              onChange={(e) => setRecommendationReason(e.target.value)}
              placeholder="Detail reasons why remote evidence is insufficient or contradictory..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Contested Evidence Reference:
            </label>
            <input
              type="text"
              required
              value={supportingEvidence}
              onChange={(e) => setSupportingEvidence(e.target.value)}
              placeholder="e.g. Master Campus Blueprint Sheet 2 & Lab Photo Room 204"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Committee Scope & Recommendations:
            </label>
            <textarea
              rows={2}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Specify areas for physical verification (e.g. Measure carpet dimensions of CAD lab)..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <span>Statutory Scrutiny Governance Note:</span>
            </div>
            <p>
              AI observations are advisory. Remote document analysis does not replace a physical inspection mandated by AICTE Council rules. This recommendation will be forwarded to the Regional Scrutiny Board.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              Submit Inspection Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
