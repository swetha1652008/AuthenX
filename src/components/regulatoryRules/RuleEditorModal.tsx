import React, { useState } from 'react';
import { 
  X, 
  FileCode2, 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Sliders, 
  ShieldCheck
} from 'lucide-react';
import type { 
  RegulatoryRuleItem, 
  RuleCategory, 
  ApplicationCategoryType, 
  ValidationMethodType, 
  RuleSeverity, 
  RuleLogicCondition,
  LogicOperator 
} from '../../types/regulatoryRules';

interface Props {
  rule?: RegulatoryRuleItem;
  onClose: () => void;
  onSave: (ruleData: Partial<RegulatoryRuleItem>) => void;
}

export const RuleEditorModal: React.FC<Props> = ({ rule, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'METADATA' | 'LOGIC' | 'REFERENCE'>('METADATA');

  // Form State
  const [requirementCode, setRequirementCode] = useState(rule?.requirementCode || `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState(rule?.title || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [category, setCategory] = useState<RuleCategory>(rule?.category || 'CHECKLIST');
  const [applicationCategory, setApplicationCategory] = useState<ApplicationCategoryType>(rule?.applicationCategory || 'ALL');
  const [documentCategory, setDocumentCategory] = useState(rule?.documentCategory || 'Land Title & Ownership Deeds');
  const [mandatory, setMandatory] = useState(rule?.mandatory ?? true);
  const [severity, setSeverity] = useState<RuleSeverity>(rule?.severity || 'CRITICAL');
  const [validationMethod, setValidationMethod] = useState<ValidationMethodType>(rule?.validationMethod || 'AUTOMATED_OCR');

  // Regulatory Reference
  const [sourceTitle, setSourceTitle] = useState(rule?.regulatoryReference.sourceTitle || 'AICTE Approval Process Handbook (APH 2026-27)');
  const [handbookSection, setHandbookSection] = useState(rule?.regulatoryReference.handbookSection || 'Chapter II, Section 2.1');
  const [aicteClause, setAicteClause] = useState(rule?.regulatoryReference.aicteClause || 'Clause 4.1.2');
  const [officialUrl, setOfficialUrl] = useState(rule?.regulatoryReference.officialUrl || 'https://www.aicte-india.org/handbook/2026-27');
  const [publicationYear, setPublicationYear] = useState(rule?.regulatoryReference.publicationYear || '2026');
  const [confirmedByAuthority, setConfirmedByAuthority] = useState(rule?.regulatoryReference.confirmedByAuthority ?? true);
  const [referenceNotes, setReferenceNotes] = useState(rule?.regulatoryReference.notes || '');

  // Conditions
  const [conditions, setConditions] = useState<RuleLogicCondition[]>(
    rule?.conditions || [
      { field: 'landAreaAcres', operator: 'GREATER_THAN_OR_EQUAL', value: 5.0, unit: 'acres' },
    ]
  );

  // Effective Dates
  const [effectiveFrom, setEffectiveFrom] = useState(rule?.effectiveFrom || '2026-04-01');
  const [effectiveTo, setEffectiveTo] = useState(rule?.effectiveTo || '2027-03-31');

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { field: 'verifiedCertificateNumber', operator: 'IS_NOT_EMPTY' },
    ]);
  };

  const handleRemoveCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const handleUpdateCondition = (idx: number, patch: Partial<RuleLogicCondition>) => {
    setConditions(
      conditions.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requirementCode.trim()) {
      alert('Please provide a valid Requirement Code and Title.');
      return;
    }

    onSave({
      id: rule?.id,
      requirementCode,
      title,
      description,
      category,
      applicationCategory,
      documentCategory,
      mandatory,
      severity,
      validationMethod,
      regulatoryReference: {
        sourceTitle,
        handbookSection,
        aicteClause,
        officialUrl,
        publicationYear,
        confirmedByAuthority,
        notes: referenceNotes,
      },
      conditions,
      effectiveFrom,
      effectiveTo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2563EB]/10 text-[#2563EB] rounded-xl">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                {rule ? 'Edit Regulatory Rule Specification' : 'Codify New Regulatory Requirement'}
              </h3>
              <p className="text-xs text-slate-500">
                AICTE Approval Process Handbook (APH 2026-27) Rule Configurator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs font-semibold gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('METADATA')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'METADATA'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Requirement Metadata
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOGIC')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'LOGIC'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Safe Logic Builder ({conditions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REFERENCE')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'REFERENCE'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Statutory Reference
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700">
          {activeTab === 'METADATA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requirement Code *</label>
                  <input
                    type="text"
                    required
                    value={requirementCode}
                    onChange={(e) => setRequirementCode(e.target.value)}
                    placeholder="e.g. REG-2026-LAND-01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rule Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RuleCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    <option value="CHECKLIST">Category Checklist Requirement</option>
                    <option value="VALIDITY">Document Validity Window</option>
                    <option value="FIELD">Field Numerical/String Validation</option>
                    <option value="CONSISTENCY">Cross-Document Consistency</option>
                    <option value="CONDITIONAL">Conditional Applicability Norm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Minimum Campus Land Area & Unencumbered Title Norms"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Institution Instructions</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clear instructions to the applicant regarding statutory compliance..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Scope</label>
                  <select
                    value={applicationCategory}
                    onChange={(e) => setApplicationCategory(e.target.value as ApplicationCategoryType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="ALL">All Applications (Universal)</option>
                    <option value="EOA">Extension of Approval (EoA)</option>
                    <option value="INTAKE_CHANGE">Intake Expansion / Changes</option>
                    <option value="NEW_PROGRAMME">New Programme / Course</option>
                    <option value="NEW_INSTITUTION">New Technical Institution</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                  <input
                    type="text"
                    value={documentCategory}
                    onChange={(e) => setDocumentCategory(e.target.value)}
                    placeholder="e.g. Land Title Deeds"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validation Engine</label>
                  <select
                    value={validationMethod}
                    onChange={(e) => setValidationMethod(e.target.value as ValidationMethodType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="AUTOMATED_OCR">Automated OCR Extraction</option>
                    <option value="API_SOURCE">Government API Source Verify</option>
                    <option value="QR_CROSSCHECK">QR Payload Crosscheck</option>
                    <option value="LOGIC_ENGINE">Mathematical / Cadre Rule Engine</option>
                    <option value="OFFICER_MANUAL">Officer Scrutiny Inspection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deficit Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as RuleSeverity)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="CRITICAL">CRITICAL (Deficit Halt)</option>
                    <option value="WARNING">WARNING (Clarification Req)</option>
                    <option value="NOTICE">NOTICE (Advisory Observation)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="mandatoryCheckbox"
                    checked={mandatory}
                    onChange={(e) => setMandatory(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] rounded border-slate-300"
                  />
                  <label htmlFor="mandatoryCheckbox" className="font-semibold text-slate-700 cursor-pointer">
                    Mandatory Requirement
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Effective From</label>
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Effective Until</label>
                  <input
                    type="date"
                    value={effectiveTo}
                    onChange={(e) => setEffectiveTo(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LOGIC' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-blue-800 text-[11px]">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
                <p>
                  <strong>Safe Logic Builder:</strong> Conditions are evaluated via a sandboxed rule engine.
                  No arbitrary code execution is permitted. Operators strictly compare structured extracted fields.
                </p>
              </div>

              <div className="space-y-2.5">
                {conditions.map((cond, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Field Key</label>
                      <input
                        type="text"
                        value={cond.field}
                        onChange={(e) => handleUpdateCondition(idx, { field: e.target.value })}
                        placeholder="e.g. landAreaAcres"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white font-mono text-xs"
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Operator</label>
                      <select
                        value={cond.operator}
                        onChange={(e) => handleUpdateCondition(idx, { operator: e.target.value as LogicOperator })}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-xs font-semibold"
                      >
                        <option value="GREATER_THAN_OR_EQUAL">&gt;= (Min Threshold)</option>
                        <option value="LESS_THAN_OR_EQUAL">&lt;= (Max Ratio)</option>
                        <option value="EQUALS">=== (Exact Match)</option>
                        <option value="NOT_EQUALS">!== (Not Match)</option>
                        <option value="IS_NOT_EMPTY">Is Present / Valid</option>
                        <option value="IS_EMPTY">Is Missing</option>
                        <option value="DATE_AFTER">Date After (Validity)</option>
                        <option value="DATE_BEFORE">Date Before</option>
                      </select>
                    </div>

                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Target Value</label>
                      <input
                        type="text"
                        value={String(cond.value ?? '')}
                        onChange={(e) => handleUpdateCondition(idx, { value: e.target.value })}
                        placeholder="e.g. 5.0 or true"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-xs"
                      />
                    </div>

                    <div className="col-span-1 text-right pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(idx)}
                        disabled={conditions.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddCondition}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1d4ed8] px-3 py-1.5 rounded-lg border border-[#2563EB]/20 bg-blue-50/50 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add Condition Clause
              </button>
            </div>
          )}

          {activeTab === 'REFERENCE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Handbook / Statute</label>
                  <input
                    type="text"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    placeholder="e.g. AICTE Approval Process Handbook (APH 2026-27)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handbook Section / Appendix</label>
                  <input
                    type="text"
                    value={handbookSection}
                    onChange={(e) => setHandbookSection(e.target.value)}
                    placeholder="e.g. Chapter II, Section 2.1.3 & Appendix 4"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statutory Clause Number *</label>
                  <input
                    type="text"
                    required
                    value={aicteClause}
                    onChange={(e) => setAicteClause(e.target.value)}
                    placeholder="e.g. Clause 4.1.2 - Land Norms"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publication Year</label>
                  <input
                    type="text"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Reference URL (AICTE Portal)</label>
                <input
                  type="url"
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                  placeholder="https://www.aicte-india.org/handbook/2026-27"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reviewer Guidance & Statutory Notes</label>
                <textarea
                  rows={2}
                  value={referenceNotes}
                  onChange={(e) => setReferenceNotes(e.target.value)}
                  placeholder="Specific scrutiny verification instructions for designated officers..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="confirmedCheckbox"
                  checked={confirmedByAuthority}
                  onChange={(e) => setConfirmedByAuthority(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded border-slate-300"
                />
                <label htmlFor="confirmedCheckbox" className="font-semibold text-slate-700 cursor-pointer">
                  Confirmed against official Gazette or Approved Process Handbook (Required before publication)
                </label>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Saving as local draft will not alter currently published validation runs.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Save className="w-3.5 h-3.5" /> Save Rule Draft
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
