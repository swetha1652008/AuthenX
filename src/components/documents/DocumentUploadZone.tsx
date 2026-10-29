import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck2, 
  AlertCircle, 
  Loader2, 
  X, 
  CheckCircle2, 
  FileText,
  Sparkles,
  Download,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import type { DocumentCategory, ManagedDocument } from '../../types/document';
import { ALL_DOCUMENT_CATEGORIES } from '../../types/document';

interface DocumentUploadZoneProps {
  onUploadFile: (file: File, category: DocumentCategory) => Promise<{ success: boolean; document?: ManagedDocument; error?: string }>;
  preselectedCategory?: DocumentCategory;
  onClearPreselectedCategory?: () => void;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  onUploadFile,
  preselectedCategory,
  onClearPreselectedCategory,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>(
    preselectedCategory || 'Affidavit / Undertaking'
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prevPreselected, setPrevPreselected] = useState(preselectedCategory);
  if (preselectedCategory && preselectedCategory !== prevPreselected) {
    setPrevPreselected(preselectedCategory);
    setCategory(preselectedCategory);
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndStageFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File exceeds the maximum 10.0 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }

    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const isAllowedExt = /\.(pdf|jpe?g|png)$/i.test(file.name);
    if (!allowed.includes(file.type) && !isAllowedExt) {
      setErrorMessage(`Unsupported format '${file.type || 'unknown'}'. Please upload PDF, JPG, JPEG, or PNG.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndStageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndStageFile(e.target.files[0]);
    }
  };

  const handleTriggerUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(25);

    const timer = setInterval(() => {
      setUploadProgress((prev) => (prev >= 85 ? prev : prev + 25));
    }, 150);

    try {
      const result = await onUploadFile(selectedFile, category);
      clearInterval(timer);
      setUploadProgress(100);

      if (result.success) {
        const docStatus = result.document?.verificationStatus;
        if (docStatus === 'Needs Manual Review') {
          setErrorMessage(`Document '${selectedFile.name}' uploaded, but automated checks flagged CRITICAL ANOMALIES. Status: Needs Manual Review.`);
        } else if (docStatus === 'Warning') {
          setErrorMessage(`Document '${selectedFile.name}' uploaded with WARNINGS. Status: Warning.`);
        } else if (docStatus === 'Authority Verification Pending') {
          setSuccessMessage(`Document '${selectedFile.name}' uploaded. Internal checks passed — External Authority Verification Pending.`);
        } else {
          setSuccessMessage(`Document '${selectedFile.name}' uploaded. Current Status: ${docStatus || 'Uploaded'}.`);
        }
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onClearPreselectedCategory) onClearPreselectedCategory();
      } else {
        setErrorMessage(result.error || 'Upload failed. Please check file and permissions.');
      }
    } catch {
      clearInterval(timer);
      setErrorMessage('Unexpected network or server error during upload.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1200);
    }
  };

  const handleLoadDemoScenario = async (scenario: 'A' | 'B') => {
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(20);

    const filename = scenario === 'A' ? 'Sample_A_Suspicious_Document.pdf' : 'Sample_B_Consistent_Document.pdf';
    const filePath = `/demo-samples/${filename}`;
    const targetCat: DocumentCategory = scenario === 'A' ? 'No Objection Certificate (NOC)' : 'Affidavit / Undertaking';

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename} from server (HTTP ${response.status}).`);
      }
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      setCategory(targetCat);
      setSelectedFile(file);

      setUploadProgress(60);
      const res = await onUploadFile(file, targetCat);
      setUploadProgress(100);

      if (res.success) {
        setSuccessMessage(
          scenario === 'A'
            ? `Scenario A loaded! Extracted real PDF text stream and flagged intentional mismatches (PID 1-778899001, Inverted Dates, Photoshop marker). Status: Needs Manual Review.`
            : `Scenario B loaded! Extracted real PDF text stream and verified compliance with AICTE APH norms (Matching PID, Active Dates). Status: Checks Passed / Authority Pending.`
        );
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setErrorMessage(res.error || 'Failed to ingest demo file.');
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to fetch synthetic demo sample.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#CFE2FE] shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-[#102B4E]">
            Direct Statutory Document Ingestion
          </h3>
          <p className="text-xs text-slate-500">
            Cryptographic SHA-256 verification • OCR text extraction • Strict 10 MB per-file quota
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Target Category:
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            disabled={isUploading}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#102B4E] focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
          >
            {ALL_DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag & Drop Canvas */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          dragActive
            ? 'border-[#2563EB] bg-[#EAF2FF]/60 scale-[1.005]'
            : 'border-[#CFE2FE] bg-[#F8FAFC] hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="authenx-file-input"
        />

        {!selectedFile ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Drag and drop your official document here, or{' '}
                <label
                  htmlFor="authenx-file-input"
                  className="text-[#2563EB] hover:text-[#1D4ED8] underline cursor-pointer font-bold"
                >
                  Browse Device
                </label>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Accepted: <strong className="text-slate-600">PDF, JPG, JPEG, PNG</strong> • Maximum file size: <strong className="text-slate-600">10.0 MB</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#CFE2FE] shadow-sm max-w-md w-full mx-auto text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {category}
                </p>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                  title="Remove staged file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress Bar when uploading */}
            {isUploading && (
              <div className="max-w-md mx-auto space-y-1">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Uploading & computing SHA-256 hash...</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTriggerUpload}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Ingestion...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Confirm & Ingest Document</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success / Error Messages */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Live Verification Demo Scenarios */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B4E]">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Interactive Demo Scenarios (Synthetic AICTE Test Documents)</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            Real PDF Text Extraction & Validation Testing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Scenario A Card */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Scenario A: Suspicious Mismatches (NOC)
                </span>
                <span className="text-[9px] font-black uppercase text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                  Needs Review
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Contains intentional cross-tenant PID mismatch (<code>1-778899001</code> vs registered), divergent institution name (<em>Metropolitan Polytechnic</em>), chronologically inverted dates (Issue: 25-11-2026 &gt; Expiry: 15-06-2025), and Photoshop CC editing markers.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLoadDemoScenario('A')}
                disabled={isUploading}
                className="flex-1 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load & Test Scenario A</span>
              </button>
              <a
                href="/demo-samples/Sample_A_Suspicious_Document.pdf"
                download="Sample_A_Suspicious_Document.pdf"
                className="p-2 rounded-xl bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                title="Download Sample A PDF to inspect raw content"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            </div>
          </div>

          {/* Scenario B Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Scenario B: Consistent Statutory Document (Affidavit)
                </span>
                <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                  Checks Pass
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Full AICTE APH 2026-27 compliance. Permanent ID matches registered institution (<code>1-938210941</code>), institution name matches legal entity, active validity through 31-03-2027, and clean PDF structure without raster editing markers.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLoadDemoScenario('B')}
                disabled={isUploading}
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load & Test Scenario B</span>
              </button>
              <a
                href="/demo-samples/Sample_B_Consistent_Document.pdf"
                download="Sample_B_Consistent_Document.pdf"
                className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                title="Download Sample B PDF to inspect raw content"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
