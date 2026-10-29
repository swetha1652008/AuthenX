import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  AlertCircle
} from 'lucide-react';
import type { InstitutionApplication } from '../../types/institution';
import type { UserAccount } from '../../types/auth';
import type { VerificationMethodType } from '../../types/issuingAuthority';

interface NewVerificationRequestModalProps {
  application: InstitutionApplication;
  currentUser: UserAccount | null;
  onClose: () => void;
  onSubmit: (data: {
    institutionId: string;
    institutionName: string;
    applicationReference: string;
    applicationCategory: string;
    certificateType: string;
    certificateNumber: string;
    referenceNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate?: string;
    verificationMethods: VerificationMethodType[];
    file: File;
    notes?: string;
  }) => Promise<void>;
}

export const NewVerificationRequestModal: React.FC<NewVerificationRequestModalProps> = ({
  application,
  currentUser: _currentUser,
  onClose,
  onSubmit,
}) => {
  const [certType, setCertType] = useState('State Fire & Emergency Services NOC');
  const [certNumber, setCertNumber] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('Karnataka State Fire and Emergency Services Department');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('2028-05-30');
  const [notes, setNotes] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<VerificationMethodType[]>([
    'QR_CODE',
    'REFERENCE_NUMBER',
    'OFFICIAL_API',
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMethod = (method: VerificationMethodType) => {
    setSelectedMethods((prev) => 
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setFormError('File size exceeds statutory maximum limit of 25 MB.');
        return;
      }
      setSelectedFile(file);
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!certNumber.trim()) {
      setFormError('Certificate number is mandatory.');
      return;
    }
    if (!refNumber.trim()) {
      setFormError('Reference number is mandatory.');
      return;
    }
    if (!issuingAuthority.trim()) {
      setFormError('Issuing authority is mandatory.');
      return;
    }
    if (!selectedFile) {
      setFormError('Please upload a supporting certificate file (PDF, PNG, JPG).');
      return;
    }
    if (selectedMethods.length === 0) {
      setFormError('Select at least one verification channel.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        institutionId: application.institution.aictePermanentId,
        institutionName: application.institution.name,
        applicationReference: application.referenceNumber,
        applicationCategory: application.type === 'EOA' ? 'Extension of Approval (EoA)' : application.changeCategory || 'Approval-related Change',
        certificateType: certType,
        certificateNumber: certNumber,
        referenceNumber: refNumber,
        issuingAuthority,
        issueDate,
        expiryDate,
        verificationMethods: selectedMethods,
        file: selectedFile,
        notes,
      });
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#102B4E]">
                New Issuing Authority Verification Request
              </h3>
              <p className="text-xs text-slate-500">
                Register a statutory document for multi-source authority validation.
              </p>
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Institution Context */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Context</span>
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-700">
              <span className="font-bold text-[#102B4E]">{application.institution.name}</span>
              <span className="font-mono text-slate-500">PID: {application.institution.aictePermanentId}</span>
              <span className="text-[#2563EB] font-bold">{application.referenceNumber}</span>
            </div>
          </div>

          {/* Section 2: Certificate Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Certificate Type *</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
              >
                <option value="State Fire & Emergency Services NOC">State Fire & Emergency Services NOC</option>
                <option value="Registered Land Ownership Title Deed">Registered Land Ownership Title Deed</option>
                <option value="Municipal Building Occupancy Certificate">Municipal Building Occupancy Certificate</option>
                <option value="University Affiliation Continuation Order">University Affiliation Continuation Order</option>
                <option value="Building Structural Stability & PWD Fitness">Building Structural Stability & PWD Fitness</option>
                <option value="Anti-Ragging Undertaking Affidavit">Anti-Ragging Undertaking Affidavit</option>
                <option value="Board of Governors Resolution">Board of Governors Resolution</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Certificate Number *</label>
              <input
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g., KFS/NOC/BLR-2026/901"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Reference / Gazette Serial *</label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g., KFS-REF-901"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Issuing Authority *</label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g., Karnataka State Fire Services"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Issue Date *</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Expiry Date (or Perpetual)</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="YYYY-MM-DD or Perpetual"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Section 3: File Upload */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Upload Supporting Certificate Document *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-slate-300 hover:border-[#2563EB] rounded-2xl bg-slate-50 text-center cursor-pointer transition-colors"
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700">Click to select PDF or Image file</p>
                  <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25 MB. SHA-256 hash calculated automatically.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Verification Channels Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Select Verification Methods to Execute *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'QR_CODE' as VerificationMethodType, label: 'QR Code Optical & Domain Verification' },
                { id: 'REFERENCE_NUMBER' as VerificationMethodType, label: 'Reference Number Registry Parity' },
                { id: 'OFFICIAL_API' as VerificationMethodType, label: 'Official Authority API Gateway' },
                { id: 'MANUAL_OFFICER' as VerificationMethodType, label: 'Manual Scrutiny by Assigned Officer' },
              ].map((m) => {
                const isSelected = selectedMethods.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 border-[#2563EB] text-[#102B4E] font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 text-[#2563EB]" /> : <Square className="w-4 h-4 text-slate-400" />}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Additional Institutional Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or context for the verification officer..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Submit for Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
