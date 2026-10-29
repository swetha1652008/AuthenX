import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  Send, 
  Clock, 
  Calendar, 
  X, 
  FileCheck, 
  AlertCircle 
} from 'lucide-react';
import type { 
  EvidenceRequest, 
  ComplianceChecklistItem, 
  ComplianceFinding 
} from '../../types/compliance';

interface EvidenceRequestModalProps {
  checklistItem?: ComplianceChecklistItem;
  finding?: ComplianceFinding;
  applicationReference: string;
  onClose: () => void;
  onSendRequest: (reqData: Omit<EvidenceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

export const EvidenceRequestModal: React.FC<EvidenceRequestModalProps> = ({
  checklistItem,
  finding,
  applicationReference,
  onClose,
  onSendRequest,
}) => {
  const [reason, setReason] = useState(
    finding?.explanation || checklistItem?.ruleTitle || ''
  );
  const [requestedEvidence, setRequestedEvidence] = useState(
    'Endorsed Architectural Floor Plan and Certified Equipment Register'
  );
  const [explanation, setExplanation] = useState(
    'Please upload an updated sanctioned floor plan with room numbers demarcated, along with geo-tagged photographs and department stock register extracts.'
  );
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [officerNotes, setOfficerNotes] = useState(
    'Formal Scrutiny Notice issued under AICTE Approval Process Handbook (APH 2026-27) Chapter II norms.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendRequest({
      assessmentId: checklistItem?.assessmentId || 'asm_default',
      checklistItemId: checklistItem?.id || finding?.checklistItemId || '',
      institutionId: '1-938210941',
      applicationReference,
      requestedBy: 'Smt. Priya Sharma (Compliance Officer)',
      reason,
      requestedEvidence,
      explanation,
      dueDate,
      officerNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Issue Additional Evidence Request
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
          {checklistItem && (
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-700">
              <div className="flex items-center gap-1 font-bold text-[#102B4E] mb-0.5">
                <FileCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Linked Requirement: {checklistItem.requirementCode}</span>
              </div>
              <p className="text-[11px] text-slate-600">{checklistItem.ruleTitle}</p>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Deficiency / Clarification Reason:
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Missing laboratory floor demarcation or equipment invoice"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Specific Evidence Document Requested:
            </label>
            <input
              type="text"
              required
              value={requestedEvidence}
              onChange={(e) => setRequestedEvidence(e.target.value)}
              placeholder="e.g. Revised Sanctioned Architectural Floor Plan (PDF)"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Detailed Instructions for Technical Institution:
            </label>
            <textarea
              rows={3}
              required
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Specify the exact pages, stamps, or geo-tagged details required..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Response Deadline Date:
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Issuing Officer:
              </label>
              <input
                type="text"
                disabled
                value="Smt. Priya Sharma (AICTE Scrutiny Officer)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Statutory Notes & Legal Authority:
            </label>
            <input
              type="text"
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Transmitting this request will update the checklist status to <strong>Evidence Requested</strong>, notify the institution administrator in their portal, and allow replacement evidence upload.
            </span>
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
              className="px-5 py-2 font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              Transmit Evidence Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
