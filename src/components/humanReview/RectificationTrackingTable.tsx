import React, { useState } from 'react';
import { 
  Search, 
  Hourglass, 
  FileText, 
  UploadCloud, 
  Calendar,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { 
  RectificationRequest, 
  RectificationStatus,
  InstitutionResponseData 
} from '../../types/humanReview';

interface RectificationTrackingTableProps {
  requests: RectificationRequest[];
  onAcceptRectification: (requestId: string, remarks: string) => void;
  onRequestFurtherCorrection: (requestId: string, instructions: string) => void;
  onSubmitMockResponse: (requestId: string, response: InstitutionResponseData) => void;
  onSelectApplication: (appId: string) => void;
}

export const RectificationTrackingTable: React.FC<RectificationTrackingTableProps> = ({
  requests,
  onAcceptRectification,
  onRequestFurtherCorrection,
  onSubmitMockResponse,
  onSelectApplication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RectificationStatus>('ALL');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Modal action states
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'ACCEPT' | 'FURTHER_CORRECTION' | 'SIMULATE_RESPONSE' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [mockFileName, setMockFileName] = useState('Replacement_Document_Signed.pdf');

  const filteredRequests = requests.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.applicationId.toLowerCase().includes(q) ||
      r.institutionName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RectificationStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Draft</span>;
      case 'SENT':
      case 'AWAITING_RESPONSE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Awaiting Response</span>;
      case 'RESPONSE_SUBMITTED':
      case 'UNDER_OFFICER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">Response Submitted</span>;
      case 'FURTHER_CORRECTION_REQUIRED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">Correction Required</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Accepted</span>;
      case 'REVALIDATION_PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Reval Ready</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">Closed</span>;
    }
  };

  const handleActionSubmit = () => {
    if (!actingRequestId) return;

    if (actionType === 'ACCEPT') {
      onAcceptRectification(actingRequestId, actionNotes || 'Accepted after officer scrutiny.');
    } else if (actionType === 'FURTHER_CORRECTION') {
      onRequestFurtherCorrection(actingRequestId, actionNotes || 'Additional clarification required.');
    } else if (actionType === 'SIMULATE_RESPONSE') {
      onSubmitMockResponse(actingRequestId, {
        submittedAt: new Date().toISOString(),
        notes: actionNotes || 'Updated documentary proof uploaded with authorized digital signature.',
        replacementDocumentName: mockFileName,
        replacementDocumentHash: '9f83a42c36b801a2c3d4e5f67890123456789abcdef0123456789abcdef01234',
        submittedBy: 'Institution Representative'
      });
    }

    setActingRequestId(null);
    setActionType(null);
    setActionNotes('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Request ID, Application, Institution, Title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | RectificationStatus)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          >
            <option value="ALL">All Rectification Statuses</option>
            <option value="AWAITING_RESPONSE">Awaiting Response</option>
            <option value="RESPONSE_SUBMITTED">Response Submitted</option>
            <option value="FURTHER_CORRECTION_REQUIRED">Further Correction Required</option>
            <option value="ACCEPTED">Accepted</option>
          </select>

          <span className="text-xs text-slate-400 font-medium">
            Total: {filteredRequests.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Notice ID & Date</th>
              <th className="py-3 px-4">Application & Institution</th>
              <th className="py-3 px-4">Category & Subject</th>
              <th className="py-3 px-4">Deadline</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No rectification notices found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const isExpanded = expandedRequestId === req.id;
                const isOverdue = req.status !== 'ACCEPTED' && req.status !== 'CLOSED' && req.dueDate < '2026-10-28';

                return (
                  <React.Fragment key={req.id}>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#102B4E]">{req.id}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Sent: {req.sentAt.split('T')[0]}
                        </div>
                      </td>

                      {/* App & Institution */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => onSelectApplication(req.applicationId)}
                          className="font-bold text-blue-600 hover:underline text-left"
                        >
                          {req.applicationId}
                        </button>
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{req.institutionName}</span>
                        </div>
                      </td>

                      {/* Category & Subject */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {req.category}
                        </span>
                        <div className="font-semibold text-slate-800 text-[11px] truncate mt-1" title={req.title}>
                          {req.title}
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{req.dueDate}</span>
                        </div>
                        {isOverdue && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">
                            Overdue
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                            title="Toggle Notice Details"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {req.status === 'RESPONSE_SUBMITTED' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setActingRequestId(req.id);
                                  setActionType('ACCEPT');
                                  setActionNotes('');
                                }}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActingRequestId(req.id);
                                  setActionType('FURTHER_CORRECTION');
                                  setActionNotes('');
                                }}
                                className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white font-semibold text-[11px] shadow-sm"
                              >
                                Reject / Re-open
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActingRequestId(req.id);
                                setActionType('SIMULATE_RESPONSE');
                                setActionNotes('');
                              }}
                              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-teal-50 text-teal-700 font-semibold text-[11px] flex items-center gap-1"
                              title="Simulate institution document submission"
                            >
                              <UploadCloud className="w-3 h-3" /> Upload Response
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={6} className="p-4 border-b border-slate-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Notice Details */}
                            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="font-bold text-[#102B4E] block text-xs">AICTE Rectification Notice Details</span>
                              <div>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Specific Deficit</span>
                                <p className="text-slate-700 mt-0.5">{req.specificReason}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Required Action</span>
                                <p className="text-slate-700 mt-0.5">{req.requiredCorrection}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Regulatory Clause</span>
                                <p className="text-slate-700 mt-0.5">{req.regulatoryClauseRef}</p>
                              </div>
                            </div>

                            {/* Response Details */}
                            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="font-bold text-[#102B4E] block text-xs">Institution Response Status</span>
                              {req.institutionResponse ? (
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Submitted Date & Representative</span>
                                    <p className="text-slate-700 mt-0.5">
                                      {req.institutionResponse.submittedAt.split('T')[0]} by {req.institutionResponse.submittedBy}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Response Notes</span>
                                    <p className="text-slate-700 mt-0.5">{req.institutionResponse.notes}</p>
                                  </div>
                                  {req.institutionResponse.replacementDocumentName && (
                                    <div>
                                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Replacement File</span>
                                      <div className="flex items-center gap-1.5 text-blue-700 font-bold mt-1">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>{req.institutionResponse.replacementDocumentName}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-slate-400 py-4 text-center">
                                  <Hourglass className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                                  <span>Awaiting institution submission. Deadline: {req.dueDate}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action Dialog Modal */}
      {actingRequestId && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">
              {actionType === 'ACCEPT' && 'Accept Institution Rectification'}
              {actionType === 'FURTHER_CORRECTION' && 'Request Further Correction / Reject Response'}
              {actionType === 'SIMULATE_RESPONSE' && 'Simulate Institution Response Upload'}
            </h4>

            {actionType === 'SIMULATE_RESPONSE' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Replacement Document Name
                </label>
                <input
                  type="text"
                  value={mockFileName}
                  onChange={(e) => setMockFileName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {actionType === 'ACCEPT' ? 'Officer Approval Remarks' : actionType === 'FURTHER_CORRECTION' ? 'Deficit / Re-submission Instructions' : 'Institution Submission Notes'}
              </label>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter remarks..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActingRequestId(null);
                  setActionType(null);
                }}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleActionSubmit}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
