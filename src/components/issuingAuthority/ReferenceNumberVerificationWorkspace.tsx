import React, { useState } from 'react';
import { 
  Hash, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Building2, 
  FileCheck2,
  Calendar
} from 'lucide-react';
import { issuingAuthorityService } from '../../services/issuingAuthorityService';
import type { ReferenceLookupDetails } from '../../types/issuingAuthority';
import type { InstitutionApplication } from '../../types/institution';

interface ReferenceNumberVerificationWorkspaceProps {
  application: InstitutionApplication;
  onSendForManualReview: (reason: string, details?: string) => void;
  onVerificationComplete?: (result: ReferenceLookupDetails) => void;
}

export const ReferenceNumberVerificationWorkspace: React.FC<ReferenceNumberVerificationWorkspaceProps> = ({
  application,
  onSendForManualReview,
  onVerificationComplete,
}) => {
  // Form State
  const [certRefNumber, setCertRefNumber] = useState('BHOOMI-77492-2018');
  const [certNumber, setCertNumber] = useState('KA-BLR-REG/2018/LND-49201');
  const [certType, setCertType] = useState('Registered Land Ownership Title Deed');
  const [instName, setInstName] = useState(application.institution.name);
  const [instId, setInstId] = useState(application.institution.aictePermanentId);
  const [issuingAuthority, setIssuingAuthority] = useState('Karnataka Department of Stamps and Registration (Bhoomi)');
  const [issueDate, setIssueDate] = useState('2018-04-12');
  const [expiryDate, setExpiryDate] = useState('Perpetual');

  const [isVerifying, setIsVerifying] = useState(false);
  const [lookupResult, setLookupResult] = useState<ReferenceLookupDetails | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!certRefNumber.trim()) errs.certRefNumber = 'Reference number is required';
    if (!issuingAuthority.trim()) errs.issuingAuthority = 'Issuing authority is required';
    if (!instName.trim()) errs.instName = 'Institution name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsVerifying(true);
    setLookupResult(null);

    try {
      const res = await issuingAuthorityService.verifyReferenceNumber(
        certRefNumber,
        issuingAuthority,
        instName
      );
      setLookupResult(res);
      if (onVerificationComplete) {
        onVerificationComplete(res);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    setCertRefNumber('');
    setCertNumber('');
    setCertType('');
    setIssuingAuthority('');
    setIssueDate('');
    setExpiryDate('');
    setLookupResult(null);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-5">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
            Method 2 Workspace
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#102B4E] mt-0.5 flex items-center gap-2">
            <Hash className="w-5 h-5 text-emerald-600" />
            Certificate Reference Number Verification
          </h3>
          <p className="text-xs text-slate-500">
            Cross-reference unique certificate numbers and gazette serials against authorized issuing registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Reference Number */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Certificate Reference Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={certRefNumber}
              onChange={(e) => setCertRefNumber(e.target.value)}
              placeholder="e.g., BHOOMI-77492-2018"
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white ${
                errors.certRefNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
              }`}
            />
            {errors.certRefNumber && <p className="text-[10px] text-rose-600">{errors.certRefNumber}</p>}
          </div>

          {/* Certificate Number */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Certificate Number (if different)
            </label>
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="e.g., KA-BLR-REG/2018/LND-49201"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Certificate Type */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Certificate Type
            </label>
            <input
              type="text"
              value={certType}
              onChange={(e) => setCertType(e.target.value)}
              placeholder="e.g., Land Title Deed"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Issuing Authority */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Issuing Authority <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={issuingAuthority}
              onChange={(e) => setIssuingAuthority(e.target.value)}
              placeholder="e.g., Department of Stamps & Registration"
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white ${
                errors.issuingAuthority ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
              }`}
            />
            {errors.issuingAuthority && <p className="text-[10px] text-rose-600">{errors.issuingAuthority}</p>}
          </div>

          {/* Institution Name */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700 block flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Institution Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Institution ID */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              AICTE Permanent ID (PID)
            </label>
            <input
              type="text"
              value={instId}
              onChange={(e) => setInstId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Issue Date */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Issue Date
            </label>
            <input
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Expiry Date
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="YYYY-MM-DD or Perpetual"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isVerifying}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md cursor-pointer disabled:opacity-60"
          >
            {isVerifying ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isVerifying ? 'Searching Authority DB...' : 'Verify Reference Number'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {lookupResult && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          {lookupResult.status === 'VERIFIED' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Record Found & Verified in Official Directory
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      {lookupResult.details}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>

              {/* Matched Record Field Ledger */}
              {lookupResult.matchedRecord && (
                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Matched Certificate ID</span>
                    <span className="font-mono font-bold text-slate-900">{lookupResult.matchedRecord.certificateNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Registered Entity</span>
                    <span className="font-semibold text-slate-900">{lookupResult.matchedRecord.institutionName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Registry Status</span>
                    <span className="font-bold text-emerald-700">{lookupResult.matchedRecord.status}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Source Not Configured — Manual Verification Available
                    </h4>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      {lookupResult.details}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSendForManualReview('Reference number not found', `Searched: ${certRefNumber} at ${issuingAuthority}`)}
                  className="px-3.5 py-2 rounded-xl bg-[#102B4E] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>Send for Manual Review</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Deterministic Verification Standard: </strong>
          AuthenX never marks a certificate authentic merely because its number matches a valid format pattern.
          Live queries are strictly matched against configured government repositories or routed to an authorized officer for manual verification.
        </div>
      </div>
    </div>
  );
};
