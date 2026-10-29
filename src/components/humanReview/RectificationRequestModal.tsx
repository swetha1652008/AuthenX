import React, { useState } from 'react';
import { 
  X, 
  Send, 
  AlertTriangle, 
  Calendar, 
  BookOpen, 
  Building2 
} from 'lucide-react';
import type { 
  RectificationRequest, 
  RectificationCategory, 
  ReviewFindingItem 
} from '../../types/humanReview';

interface RectificationRequestModalProps {
  applicationId: string;
  institutionName: string;
  institutionId: string;
  preselectedFinding?: ReviewFindingItem;
  officerName: string;
  onClose: () => void;
  onSubmit: (
    reqData: Omit<RectificationRequest, 'id' | 'status' | 'sentAt' | 'updatedAt'>
  ) => void;
}

export const RectificationRequestModal: React.FC<RectificationRequestModalProps> = ({
  applicationId,
  institutionName,
  institutionId,
  preselectedFinding,
  officerName,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<RectificationCategory>(
    (preselectedFinding?.category as RectificationCategory) || 'FACULTY_DEFICIENCY'
  );
  const [title, setTitle] = useState(
    preselectedFinding ? `Rectification Notice: ${preselectedFinding.title}` : `Rectification Notice - ${applicationId}`
  );
  const [regulatoryClauseRef, setRegulatoryClauseRef] = useState(
    preselectedFinding?.ruleRef || 'AICTE Approval Process Handbook (APH) 2026-27, Clause 4.1'
  );
  const [specificReason, setSpecificReason] = useState(
    preselectedFinding?.aiObservation || ''
  );
  const [requiredCorrection, setRequiredCorrection] = useState(
    'Submit attested resolution and updated documentary proof verifying compliance with the mandated statutory standard.'
  );
  const [institutionInstructions, setInstitutionInstructions] = useState(
    'Upload replacement PDF files signed digitally with valid Class 3 DSC. Failure to comply before the deadline will affect final EoA consideration.'
  );
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !specificReason.trim() || !requiredCorrection.trim()) return;

    onSubmit({
      applicationId,
      institutionId,
      institutionName,
      findingId: preselectedFinding?.id,
      category,
      title: title.trim(),
      specificReason: specificReason.trim(),
      regulatoryClauseRef: regulatoryClauseRef.trim(),
      requiredCorrection: requiredCorrection.trim(),
      institutionInstructions: institutionInstructions.trim(),
      dueDate,
      sentBy: officerName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Issue Formal Rectification Notice</h3>
              <p className="text-xs text-amber-100 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" />
                {institutionName} ({applicationId})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Category & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Discrepancy Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RectificationCategory)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="FACULTY_DEFICIENCY">Faculty Cadre / Shortfall</option>
                <option value="INFRASTRUCTURE_MISMATCH">Infrastructure & Lab Area</option>
                <option value="LAND_DOCUMENT_DISCREPANCY">Land & Lease Validity</option>
                <option value="CADRE_RATIO_VIOLATION">Cadre Ratio Discrepancy</option>
                <option value="FINANCIAL_EXPIRED">Audited Financials Expired</option>
                <option value="SAFETY_CERTIFICATE">Fire / Structural Safety NOC</option>
                <option value="AFFILIATION_PENDING">University Affiliation Order</option>
                <option value="OTHER">Other Statutory Requirement</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Response Deadline *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Notice Title / Subject *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rectification Notice: Shortfall of 2 Associate Professors in CSE"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Regulatory Clause Reference */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Regulatory Handbook Clause Reference
            </label>
            <input
              type="text"
              value={regulatoryClauseRef}
              onChange={(e) => setRegulatoryClauseRef(e.target.value)}
              placeholder="e.g. AICTE Approval Process Handbook (APH) 2026-27, Clause 4.1.2 & Table 4.1"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Specific Reason */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Specific Deficit / Reason for Notice *
            </label>
            <textarea
              rows={2}
              required
              value={specificReason}
              onChange={(e) => setSpecificReason(e.target.value)}
              placeholder="Describe the exact shortfall or discrepancy detected..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Required Correction */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Required Remedial Action *
            </label>
            <textarea
              rows={2}
              required
              value={requiredCorrection}
              onChange={(e) => setRequiredCorrection(e.target.value)}
              placeholder="Specify the replacement documentation or affidavit required..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Submission Guidelines for Institution
            </label>
            <textarea
              rows={2}
              value={institutionInstructions}
              onChange={(e) => setInstitutionInstructions(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Warning Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              Dispatching this notice will immediately notify the institution portal, update the application timeline, and set an active deadline countdown.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" /> Issue Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
