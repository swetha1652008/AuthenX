import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Copy, 
  Power, 
  History, 
  X, 
  Edit3, 
  Save
} from 'lucide-react';
import type { ComplianceRule } from '../../types/compliance';

interface RuleManagementModalProps {
  rules: ComplianceRule[];
  onClose: () => void;
  onSaveRule: (rule: ComplianceRule) => void;
  onDuplicateRule: (ruleId: string) => void;
  onToggleRuleActive: (ruleId: string, active: boolean) => void;
}

export const RuleManagementModal: React.FC<RuleManagementModalProps> = ({
  rules,
  onClose,
  onSaveRule,
  onDuplicateRule,
  onToggleRuleActive,
}) => {
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewHistoryRule, setViewHistoryRule] = useState<ComplianceRule | null>(null);

  // Form fields
  const [requirementCode, setRequirementCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [regulatorySource, setRegulatorySource] = useState('AICTE Approval Process Handbook (APH 2026-27)');
  const [sourceReference, setSourceReference] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [mandatory, setMandatory] = useState(true);
  const [reviewerInstructions, setReviewerInstructions] = useState('');

  const handleStartCreate = () => {
    setSelectedRule(null);
    setRequirementCode(`REG-2026-CUSTOM-${Math.floor(Math.random() * 900 + 100)}`);
    setTitle('');
    setDescription('');
    setRegulatorySource('AICTE Approval Process Handbook (APH 2026-27)');
    setSourceReference('Chapter II, Section 2.4');
    setAcademicYear('2026-2027');
    setMandatory(true);
    setReviewerInstructions('');
    setIsEditing(true);
  };

  const handleStartEdit = (rule: ComplianceRule) => {
    setSelectedRule(rule);
    setRequirementCode(rule.requirementCode);
    setTitle(rule.title);
    setDescription(rule.description);
    setRegulatorySource(rule.regulatorySource);
    setSourceReference(rule.sourceReference);
    setAcademicYear(rule.academicYear);
    setMandatory(rule.mandatory);
    setReviewerInstructions(rule.reviewerInstructions);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const ruleToSave: ComplianceRule = selectedRule
      ? {
          ...selectedRule,
          requirementCode,
          title,
          description,
          regulatorySource,
          sourceReference,
          academicYear,
          mandatory,
          reviewerInstructions,
          updatedAt: now,
        }
      : {
          id: `rule_custom_${Date.now()}`,
          requirementCode,
          title,
          description,
          regulatorySource,
          sourceReference,
          applicableCategories: ['ALL', 'EOA', 'CHANGE'],
          academicYear,
          ruleVersion: 'v2026.1',
          requiredEvidenceTypes: ['Statutory Affidavit / Compliance Report'],
          validationConfig: {},
          mandatory,
          effectiveFrom: '2026-04-01',
          effectiveTo: '2027-03-31',
          active: true,
          reviewerInstructions,
          createdBy: 'AICTE Regulatory Officer',
          updatedBy: 'AICTE Regulatory Officer',
          createdAt: now,
          updatedAt: now,
          history: [
            {
              version: 'v2026.1',
              changedBy: 'AICTE Regulatory Officer',
              changedAt: now,
              changeSummary: 'Authored custom statutory requirement.',
            },
          ],
        };

    onSaveRule(ruleToSave);
    setIsEditing(false);
    setSelectedRule(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Configurable Regulatory Checklist Management
              </h3>
              <p className="text-xs text-slate-500">
                Author and version-control regulatory checks in accordance with official AICTE Approval Process Handbooks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartCreate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Requirement
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto text-xs">
          {isEditing ? (
            /* Edit / Create Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="text-sm font-bold text-[#102B4E]">
                  {selectedRule ? `Edit Rule: ${selectedRule.requirementCode}` : 'Create New Statutory Requirement'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-slate-500 hover:underline"
                >
                  Cancel Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Requirement Code:
                  </label>
                  <input
                    type="text"
                    required
                    value={requirementCode}
                    onChange={(e) => setRequirementCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Academic Year:
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Obligation Type:
                  </label>
                  <select
                    value={mandatory ? 'true' : 'false'}
                    onChange={(e) => setMandatory(e.target.value === 'true')}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="true">Mandatory Statutory Requirement</option>
                    <option value="false">Conditional / Advisory Norm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Requirement Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clean Energy Solar Panel Provisioning Norm"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Full Description & Thresholds:
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Official Regulatory Source:
                  </label>
                  <input
                    type="text"
                    required
                    value={regulatorySource}
                    onChange={(e) => setRegulatorySource(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Source Section Reference:
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceReference}
                    onChange={(e) => setSourceReference(e.target.value)}
                    placeholder="e.g. Chapter II, Section 2.1 & Table 4.1"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Scrutiny Reviewer Instructions:
                </label>
                <textarea
                  rows={2}
                  value={reviewerInstructions}
                  onChange={(e) => setReviewerInstructions(e.target.value)}
                  placeholder="Instructions for compliance officers inspecting submitted documents..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save Configuration
                </button>
              </div>
            </form>
          ) : viewHistoryRule ? (
            /* Rule History View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-[#102B4E]">
                    Audit History for {viewHistoryRule.requirementCode}: {viewHistoryRule.title}
                  </h4>
                  <p className="text-xs text-slate-500">Current Active Version: {viewHistoryRule.ruleVersion}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewHistoryRule(null)}
                  className="text-slate-600 hover:underline"
                >
                  Back to Rules List
                </button>
              </div>

              <div className="space-y-2">
                {viewHistoryRule.history?.map((h) => (
                  <div key={h.version} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2563EB] font-mono">{h.version}</span>
                      <span className="text-slate-400 text-[11px]">{h.changedAt}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{h.changeSummary}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Author: {h.changedBy}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Rules Master Table */
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                      <th className="py-2.5 px-3">Rule Code & Title</th>
                      <th className="py-2.5 px-3">Regulatory Source</th>
                      <th className="py-2.5 px-2 text-center">Version</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-3 max-w-sm">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {rule.requirementCode}
                            </span>
                            {rule.mandatory ? (
                              <span className="text-[9px] font-bold text-rose-600 uppercase">Mandatory</span>
                            ) : (
                              <span className="text-[9px] font-medium text-slate-400">Conditional</span>
                            )}
                          </div>
                          <p className="font-bold text-slate-900 line-clamp-1">{rule.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{rule.description}</p>
                        </td>

                        <td className="py-3 px-3 text-slate-600 max-w-[220px]">
                          <p className="font-medium text-slate-800 line-clamp-1">{rule.regulatorySource}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{rule.sourceReference}</p>
                        </td>

                        <td className="py-3 px-2 text-center font-mono text-[11px] font-bold text-slate-700">
                          {rule.ruleVersion}
                        </td>

                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rule.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {rule.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(rule)}
                              className="p-1 rounded text-slate-600 hover:text-[#2563EB] hover:bg-slate-100"
                              title="Edit Rule"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDuplicateRule(rule.id)}
                              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                              title="Duplicate Rule"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setViewHistoryRule(rule)}
                              className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                              title="View History"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onToggleRuleActive(rule.id, !rule.active)}
                              className={`p-1 rounded ${
                                rule.active
                                  ? 'text-rose-600 hover:bg-rose-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={rule.active ? 'Deactivate Rule' : 'Activate Rule'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
