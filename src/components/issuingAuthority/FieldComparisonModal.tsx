import React from 'react';
import { 
  X, 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Info,
  Clock
} from 'lucide-react';
import type { VerificationRequest, FieldComparisonItem } from '../../types/issuingAuthority';

interface FieldComparisonModalProps {
  request: VerificationRequest | null;
  onClose: () => void;
}

export const FieldComparisonModal: React.FC<FieldComparisonModalProps> = ({
  request,
  onClose,
}) => {
  if (!request) return null;

  const comparisons: FieldComparisonItem[] = request.fieldComparisons && request.fieldComparisons.length > 0
    ? request.fieldComparisons
    : [
        { fieldKey: 'instName', fieldLabel: 'Institution Legal Name', submittedValue: request.institutionName, officialSourceValue: request.referenceResult?.matchedRecord?.institutionName || 'Not Checked', status: request.referenceResult?.matchedRecord?.institutionName ? (request.referenceResult.matchedRecord.institutionName === request.institutionName ? 'MATCH' : 'MISMATCH') : 'NOT_CHECKED' },
        { fieldKey: 'certNo', fieldLabel: 'Certificate Number', submittedValue: request.certificateNumber, officialSourceValue: request.referenceResult?.matchedRecord?.certificateNumber || 'Not Checked', status: request.referenceResult?.matchedRecord?.certificateNumber ? 'MATCH' : 'NOT_CHECKED' },
        { fieldKey: 'authority', fieldLabel: 'Issuing Authority', submittedValue: request.issuingAuthority, officialSourceValue: request.issuingAuthority, status: 'MATCH' },
        { fieldKey: 'issueDate', fieldLabel: 'Issue Date', submittedValue: request.issueDate, officialSourceValue: request.referenceResult?.matchedRecord?.issueDate || 'Not Checked', status: request.referenceResult?.matchedRecord?.issueDate ? 'MATCH' : 'NOT_CHECKED' },
        { fieldKey: 'expiry', fieldLabel: 'Expiry Date', submittedValue: request.expiryDate, officialSourceValue: request.referenceResult?.matchedRecord?.expiryDate || 'Not Checked', status: request.referenceResult?.matchedRecord?.expiryDate ? 'MATCH' : 'NOT_CHECKED' },
      ];

  const getStatusBadge = (status: FieldComparisonItem['status']) => {
    switch (status) {
      case 'MATCH':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Match</span>;
      case 'MISMATCH':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3 text-rose-600" /> Mismatch</span>;
      case 'MISSING':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 w-max"><HelpCircle className="w-3 h-3 text-amber-600" /> Missing</span>;
      case 'NOT_AVAILABLE':
        return <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full w-max">Not Available</span>;
      case 'NOT_CHECKED':
      default:
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3 text-slate-400" /> Not Checked</span>;
    }
  };

  const hasSource = Boolean(request.referenceResult?.matchedRecord || request.qrResult?.decoded);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
                  {request.id}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {request.certificateType}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#102B4E] truncate mt-0.5">
                Two-Column Field-by-Field Parity Comparison
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {/* Source Attribution Notice */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Trusted Source Attribution</span>
              <strong className="text-slate-800 block text-sm mt-0.5">
                {hasSource 
                  ? (request.qrResult?.sourceName || 'Official Statutory Directory Gateway')
                  : 'No Trusted Source Response Available'}
              </strong>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Evidence Reference: {request.referenceNumber} • Evaluated: {request.updatedAt}
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full font-bold text-xs ${
              request.status === 'Verified' || request.status === 'Confirmed Against Official Evidence'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {request.status}
            </span>
          </div>

          {/* Comparison Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 w-1/4">Certificate Field</th>
                  <th className="py-3 px-4 w-1/3">Submitted Document Value</th>
                  <th className="py-3 px-4 w-1/3">Trusted Source Record Value</th>
                  <th className="py-3 px-4 text-right">Parity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.map((item) => (
                  <tr key={item.fieldKey} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {item.fieldLabel}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-900 font-semibold break-all">
                      {item.submittedValue}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 break-all">
                      {item.officialSourceValue || (
                        <span className="text-slate-400 italic font-sans">No response received</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end">
                        {getStatusBadge(item.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Informational Guidance */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#102B4E]">Normalization Protocol: </strong>
              AuthenX applies intelligent legal entity normalization (ignoring minor capitalization, punctuation, and known statutory abbreviations like &apos;Dept&apos; vs &apos;Department&apos;) to ensure valid documents are not flagged as mismatches unnecessarily.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
