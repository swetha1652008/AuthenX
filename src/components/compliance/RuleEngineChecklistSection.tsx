import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileQuestion, 
  FileText, 
  ExternalLink, 
  Eye, 
  MessageSquarePlus, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import type { 
  ComplianceAssessment, 
  ComplianceChecklistItem, 
  ComplianceRule 
} from '../../types/compliance';

interface RuleEngineChecklistSectionProps {
  assessment: ComplianceAssessment;
  applicableRules: ComplianceRule[];
  onOpenAssessModal: (item: ComplianceChecklistItem) => void;
  onOpenEvidenceRequestModal: (item: ComplianceChecklistItem) => void;
  onOpenEvidencePreview: (evidenceId: string) => void;
  onOpenComparison: (item: ComplianceChecklistItem) => void;
}

export const RuleEngineChecklistSection: React.FC<RuleEngineChecklistSectionProps> = ({
  assessment,
  applicableRules,
  onOpenAssessModal,
  onOpenEvidenceRequestModal,
  onOpenEvidencePreview,
  onOpenComparison,
}) => {
  const getEvidenceStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Submitted
          </span>
        );
      case 'REPLACED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Replaced (v2+)
          </span>
        );
      case 'PARTIALLY_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Incomplete
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <FileQuestion className="w-3 h-3" /> Not Submitted
          </span>
        );
    }
  };

  const getOfficerResultBadge = (result: string) => {
    switch (result) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Approved
          </span>
        );
      case 'FLAGGED_DEFICIENCY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
            Deficiency Flagged
          </span>
        );
      case 'RECTIFICATION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
            Rectification Req.
          </span>
        );
      case 'INSPECTION_RECOMMENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
            Inspection Rec.
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
            Unassessed
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Rules Engine Flow Banner */}
      <div className="bg-[#F0F5FF] border-b border-[#CFE2FE] p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
              Category Rules Engine Execution Chain
            </span>
            <h3 className="text-sm font-bold text-[#102B4E]">
              Dynamic Checklist Generation for {assessment.applicationCategory === 'EOA' ? 'Extension of Approval' : 'Approval Changes'} ({assessment.academicYear})
            </h3>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[#2563EB]">{assessment.applicationCategory}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{applicableRules.length} Active Rules</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{assessment.items.length} Checklist Items</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{assessment.evidence.length} Evidence Uploads</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">{assessment.items.filter((i) => i.officerResult === 'APPROVED').length} Confirmed</span>
          </div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Code & Requirement Title</th>
              <th className="py-3 px-3">Regulatory Source</th>
              <th className="py-3 px-2 text-center">Status</th>
              <th className="py-3 px-3">Evidence State</th>
              <th className="py-3 px-3">Preliminary AI Check</th>
              <th className="py-3 px-3">Officer Finding</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {assessment.items.map((item) => {
              const rule = applicableRules.find((r) => r.id === item.ruleId);

              return (
                <tr key={item.id} className="hover:bg-blue-50/30 transition">
                  {/* Code & Title */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[11px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {item.requirementCode}
                      </span>
                      {item.mandatory ? (
                        <span className="text-[10px] font-bold text-rose-600 uppercase">Mandatory</span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">Conditional</span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 leading-snug line-clamp-2">
                      {item.ruleTitle}
                    </p>
                    {rule && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        Req. Evidence: {rule.requiredEvidenceTypes.join(', ')}
                      </p>
                    )}
                  </td>

                  {/* Regulatory Source */}
                  <td className="py-3 px-3 text-slate-600 max-w-[200px]">
                    <p className="font-semibold text-slate-800 line-clamp-1">{item.regulatorySource}</p>
                    {rule && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 font-mono">
                        {rule.sourceReference}
                      </p>
                    )}
                  </td>

                  {/* Review Status Pill */}
                  <td className="py-3 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {item.reviewStatus}
                    </span>
                  </td>

                  {/* Evidence State */}
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      {getEvidenceStatusBadge(item.evidenceStatus)}
                      {item.linkedEvidenceIds.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {item.linkedEvidenceIds.map((evId) => (
                            <button
                              key={evId}
                              type="button"
                              onClick={() => onOpenEvidencePreview(evId)}
                              className="text-[10px] text-[#2563EB] hover:underline flex items-center gap-0.5"
                            >
                              <FileText className="w-3 h-3" /> View Evidence
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Preliminary AI Check */}
                  <td className="py-3 px-3">
                    {item.preliminaryResult === 'COMPLIANT' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Compliant
                      </span>
                    )}
                    {item.preliminaryResult === 'POTENTIAL_GAP' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Potential Gap
                      </span>
                    )}
                    {item.preliminaryResult === 'DEFICIENT' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Deficient
                      </span>
                    )}
                    {item.preliminaryResult === 'PENDING_ANALYSIS' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> Pending Analysis
                      </span>
                    )}
                  </td>

                  {/* Officer Result */}
                  <td className="py-3 px-3">
                    <div>
                      {getOfficerResultBadge(item.officerResult)}
                      {item.reviewerNotes && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic title={item.reviewerNotes}">
                          "{item.reviewerNotes}"
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenAssessModal(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-[#2563EB] transition title='Record Officer Assessment'"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenComparison(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition title='Compare Evidence & Requirements'"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenEvidenceRequestModal(item)}
                        className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition title='Request Additional Evidence'"
                      >
                        <MessageSquarePlus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Rule configurations strictly reference authoritative AICTE APH regulations. Unconfigured criteria are flagged as "Rule Configuration Required".</span>
        </div>
        <span className="font-mono text-slate-600">Active Rule Engine: {assessment.ruleVersion}</span>
      </div>
    </div>
  );
};
