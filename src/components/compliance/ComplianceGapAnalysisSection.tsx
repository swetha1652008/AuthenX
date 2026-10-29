import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquarePlus, 
  Compass, 
  HelpCircle
} from 'lucide-react';
import type { 
  ComplianceAssessment, 
  ComplianceFinding 
} from '../../types/compliance';

interface ComplianceGapAnalysisSectionProps {
  assessment: ComplianceAssessment;
  onOpenChecklistItem: (itemId: string) => void;
  onRequestEvidenceForFinding: (finding: ComplianceFinding) => void;
  onRecommendInspection: (finding: ComplianceFinding) => void;
  onResolveFinding: (findingId: string) => void;
}

export const ComplianceGapAnalysisSection: React.FC<ComplianceGapAnalysisSectionProps> = ({
  assessment,
  onOpenChecklistItem,
  onRequestEvidenceForFinding,
  onRecommendInspection,
  onResolveFinding,
}) => {
  const findings = assessment.findings;

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> WARNING
          </span>
        );
      case 'NOTICE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <HelpCircle className="w-3 h-3 text-blue-600" /> NOTICE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            VERIFIED
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-[#102B4E]">
              Compliance Gap Analysis & Discrepancies
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic rule-engine deficits and preliminary AI vision observations requiring scrutiny officer disposition.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
          {findings.filter((f) => f.status === 'OPEN').length} Open Gaps Requiring Attention
        </span>
      </div>

      {findings.length > 0 ? (
        <div className="space-y-3">
          {findings.map((fnd) => (
            <div
              key={fnd.id}
              className={`p-4 rounded-xl border transition ${
                fnd.status === 'RESOLVED'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : fnd.severity === 'CRITICAL'
                  ? 'bg-rose-50/40 border-rose-200'
                  : fnd.severity === 'WARNING'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-blue-50/40 border-blue-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(fnd.severity)}
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {fnd.findingCategory.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Source: {fnd.sourceType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ref: {fnd.ruleVersion}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    fnd.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {fnd.status}
                </span>
              </div>

              {/* Explanation */}
              <p className="text-xs font-bold text-slate-900 mb-1">
                {fnd.explanation}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 mb-3">
                <div>
                  <span className="font-semibold text-slate-700 block">Supporting Evidence Ref:</span>
                  <span className="text-slate-600 font-mono">{fnd.evidenceReference}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Recommended Next Step:</span>
                  <span className="text-[#2563EB]">{fnd.recommendedNextStep}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 text-xs">
                {fnd.checklistItemId && (
                  <button
                    type="button"
                    onClick={() => onOpenChecklistItem(fnd.checklistItemId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Open Checklist Item
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onRequestEvidenceForFinding(fnd)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition shadow-2xs font-semibold"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600" /> Request Additional Evidence
                </button>

                <button
                  type="button"
                  onClick={() => onRecommendInspection(fnd)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition shadow-2xs font-semibold"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-600" /> Recommend Inspection
                </button>

                {fnd.status === 'OPEN' && (
                  <button
                    type="button"
                    onClick={() => onResolveFinding(fnd.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition shadow-2xs font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 text-xs">
          No compliance gaps or infrastructure discrepancies identified on this assessment.
        </div>
      )}
    </div>
  );
};
