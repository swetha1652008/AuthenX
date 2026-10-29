import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileCode2, 
  Play, 
  Copy, 
  History, 
  GitCompare, 
  Edit3, 
  CheckCircle, 
  Send, 
  XCircle, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { 
  RegulatoryRuleItem, 
  RuleCategory, 
  RulePublicationStatus 
} from '../../types/regulatoryRules';

interface Props {
  rules: RegulatoryRuleItem[];
  onOpenEditor: (rule?: RegulatoryRuleItem) => void;
  onOpenTester: (rule: RegulatoryRuleItem) => void;
  onOpenVersionCompare: (rule: RegulatoryRuleItem) => void;
  onOpenAuditHistory: (rule: RegulatoryRuleItem) => void;
  onSubmitForReview: (id: string) => void;
  onApprove: (id: string) => void;
  onPublish: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const RulesMasterTable: React.FC<Props> = ({
  rules,
  onOpenEditor,
  onOpenTester,
  onOpenVersionCompare,
  onOpenAuditHistory,
  onSubmitForReview,
  onApprove,
  onPublish,
  onDeactivate,
  onDuplicate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [appCategoryFilter, setAppCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchSearch =
        r.requirementCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.regulatoryReference.aicteClause.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.documentCategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = categoryFilter === 'ALL' || r.category === categoryFilter;
      const matchAppCat = appCategoryFilter === 'ALL' || r.applicationCategory === appCategoryFilter;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;

      return matchSearch && matchCat && matchAppCat && matchStatus;
    });
  }, [rules, searchTerm, categoryFilter, appCategoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRules.length / pageSize) || 1;
  const paginatedRules = filteredRules.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: RulePublicationStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'APPROVED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CHANGES_REQUESTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DRAFT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'DEACTIVATED':
      case 'SUPERSEDED':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const getCategoryBadge = (cat: RuleCategory) => {
    switch (cat) {
      case 'CHECKLIST':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'VALIDITY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FIELD':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONSISTENCY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONDITIONAL':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Filters Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, title, clause, or document category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rule Category */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Rule Category"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Rule Categories</option>
            <option value="CHECKLIST">Category Checklists</option>
            <option value="VALIDITY">Document Validity</option>
            <option value="FIELD">Field Validation</option>
            <option value="CONSISTENCY">Cross-Doc Consistency</option>
            <option value="CONDITIONAL">Conditional Norms</option>
          </select>

          {/* Application Category */}
          <select
            value={appCategoryFilter}
            onChange={(e) => {
              setAppCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Application Category"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Application Scopes</option>
            <option value="EOA">Extension of Approval (EoA)</option>
            <option value="INTAKE_CHANGE">Intake Expansion / Changes</option>
            <option value="NEW_PROGRAMME">New Programme / Course</option>
            <option value="NEW_INSTITUTION">New Technical Institution</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Publication Status"
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="ALL">All Publication Statuses</option>
            <option value="PUBLISHED">Published (Active)</option>
            <option value="UNDER_REVIEW">In Scrutiny Review</option>
            <option value="APPROVED">Approved for Release</option>
            <option value="DRAFT">Local Drafts</option>
            <option value="DEACTIVATED">Deactivated / Archived</option>
          </select>

          {(categoryFilter !== 'ALL' || appCategoryFilter !== 'ALL' || statusFilter !== 'ALL' || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('ALL');
                setAppCategoryFilter('ALL');
                setStatusFilter('ALL');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Requirement Code & Title</th>
              <th className="py-3 px-3">Rule Type</th>
              <th className="py-3 px-3">Statutory Clause & Source</th>
              <th className="py-3 px-3">Validation Engine</th>
              <th className="py-3 px-3">Version & Status</th>
              <th className="py-3 px-3">Effective AY</th>
              <th className="py-3 px-4 text-right">Scrutiny Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRules.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <FileCode2 className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-600">No regulatory rules found</p>
                    <p className="text-[11px] text-slate-400">
                      Try adjusting filters or search keywords, or create a new rule specification.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRules.map((rule) => {
                return (
                  <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Requirement Code & Title */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#102B4E] flex items-center gap-1.5">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {rule.requirementCode}
                        </span>
                        {rule.mandatory && (
                          <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-rose-50 text-rose-600 border border-rose-200">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium line-clamp-1 mt-0.5">
                        {rule.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        Doc: {rule.documentCategory}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(rule.category)}`}>
                        {rule.category}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Scope: {rule.applicationCategory}
                      </div>
                    </td>

                    {/* Statutory Clause */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                        {rule.regulatoryReference.aicteClause}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {rule.regulatoryReference.sourceTitle}
                      </div>
                      {rule.regulatoryReference.officialUrl && (
                        <a
                          href={rule.regulatoryReference.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[#2563EB] hover:underline mt-0.5"
                        >
                          Official URL <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>

                    {/* Validation Engine */}
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {rule.validationMethod.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {rule.conditions.length} condition{rule.conditions.length === 1 ? '' : 's'}
                      </div>
                    </td>

                    {/* Version & Status */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-700">
                          {rule.version}
                        </span>
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(rule.status)}`}>
                        {rule.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Effective Dates */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      <div>From: {rule.effectiveFrom}</div>
                      {rule.effectiveTo && (
                        <div className="text-[10px] text-slate-400">To: {rule.effectiveTo}</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Run Rule Test */}
                        <button
                          type="button"
                          onClick={() => onOpenTester(rule)}
                          title="Simulate Rule Engine Test"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>

                        {/* Compare Versions */}
                        <button
                          type="button"
                          onClick={() => onOpenVersionCompare(rule)}
                          title="Compare Rule Versions"
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>

                        {/* Audit History */}
                        <button
                          type="button"
                          onClick={() => onOpenAuditHistory(rule)}
                          title="View Audit Trail"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Rule */}
                        <button
                          type="button"
                          onClick={() => onOpenEditor(rule)}
                          title="Edit Rule Specification"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => onDuplicate(rule.id)}
                          title="Duplicate as New Draft"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Workflow Lifecycle Action Buttons */}
                        {rule.status === 'DRAFT' && (
                          <button
                            type="button"
                            onClick={() => onSubmitForReview(rule.id)}
                            title="Submit for Council Review"
                            className="px-2 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 flex items-center gap-1"
                          >
                            <Send className="w-2.5 h-2.5" /> Submit
                          </button>
                        )}

                        {rule.status === 'UNDER_REVIEW' && (
                          <button
                            type="button"
                            onClick={() => onApprove(rule.id)}
                            title="Approve for Publication"
                            className="px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1"
                          >
                            <CheckCircle className="w-2.5 h-2.5" /> Approve
                          </button>
                        )}

                        {rule.status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => onPublish(rule.id)}
                            title="Publish Active Rule"
                            className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1"
                          >
                            <CheckCircle className="w-2.5 h-2.5" /> Publish
                          </button>
                        )}

                        {rule.status === 'PUBLISHED' && (
                          <button
                            type="button"
                            onClick={() => onDeactivate(rule.id)}
                            title="Deactivate Rule"
                            className="px-2 py-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1"
                          >
                            <XCircle className="w-2.5 h-2.5" /> Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{filteredRules.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, filteredRules.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredRules.length}</span> regulatory requirements
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
