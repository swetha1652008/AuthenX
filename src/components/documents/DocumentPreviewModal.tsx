import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  Copy,
  Check
} from 'lucide-react';
import type { ManagedDocument } from '../../types/document';

interface DocumentPreviewModalProps {
  document: ManagedDocument | null;
  initialTab?: 'preview' | 'ocr' | 'values' | 'anomalies' | 'verification';
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  initialTab = 'preview',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'ocr' | 'values' | 'anomalies' | 'verification'>(initialTab);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyText = () => {
    if (document.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isImage = document.mimeType.startsWith('image/') || /\.(jpe?g|png)$/i.test(document.originalFilename);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
                  {document.id}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {document.documentCategory}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#102B4E] truncate mt-0.5" title={document.originalFilename}>
                {document.originalFilename}
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

        {/* Tab Selection Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-6 bg-white text-xs font-bold text-slate-500 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ocr')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ocr'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Extracted OCR Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('values')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'values'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Candidate Values</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('anomalies')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'anomalies'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Anomalies & Checks</span>
            {document.anomalies && document.anomalies.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {document.anomalies.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verification Checks & Evidence</span>
            {document.verificationChecks && document.verificationChecks.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                {document.verificationChecks.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[360px] bg-[#F8FAFC]">
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Zoom Controls */}
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500">
                  <span>MIME: {document.mimeType}</span> • <span>Size: {document.fileSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(50, prev - 25))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-700 min-w-[45px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(200, prev + 25))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rendered Preview Document Container */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[300px] flex items-center justify-center overflow-auto shadow-inner">
                {isImage ? (
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="transition-transform duration-200"
                  >
                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center max-w-lg">
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{document.originalFilename}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Image Preview Canvas • SHA-256 Validated
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="w-full max-w-2xl bg-white border border-slate-300 rounded-xl shadow-md p-8 text-slate-800 transition-transform duration-200 space-y-4"
                  >
                    <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                          Official Statutory Document
                        </span>
                        <h4 className="text-sm font-black text-slate-900 uppercase">
                          {document.documentCategory}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded border border-blue-200">
                        {document.id}
                      </span>
                    </div>

                    <div className="py-4 space-y-2 text-xs font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line">
                      {document.extractedText || 'No plain text extracted for this document.'}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Cryptographic Hash: {document.sha256Hash.substring(0, 24)}...</span>
                      <span>Page 1 of 1</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EXTRACTED OCR TEXT */}
          {activeTab === 'ocr' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">
                    Raw OCR Transcribed Text Stream
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Engine: Local OCR Engine v5.3 / Native PDF Text Parser (Simulated)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#2563EB] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto shadow-inner">
                {document.extractedText || 'No text extracted.'}
              </div>
            </div>
          )}

          {/* TAB 3: CANDIDATE VALUES */}
          {activeTab === 'values' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700">
                  Extracted Regulatory Candidate Attributes
                </h4>
                <p className="text-[11px] text-slate-400">
                  Parsed key-value pairs for statutory AICTE compliance cross-checks
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Document Number / Serial
                  </span>
                  <span className="font-mono font-bold text-slate-900 mt-1 block">
                    {document.candidateValues?.documentNumber || 'Not Identified'}
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Institution Name
                  </span>
                  <span className="font-semibold text-slate-900 mt-1 block">
                    {document.candidateValues?.institutionName || 'Not Identified'}
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Issue Date
                  </span>
                  <span className="font-mono font-semibold text-slate-900 mt-1 block">
                    {document.candidateValues?.issueDate || 'Not Identified'}
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Expiry Date
                  </span>
                  <span className={`font-mono font-bold mt-1 block ${document.isExpired ? 'text-rose-600' : 'text-slate-900'}`}>
                    {document.candidateValues?.expiryDate || 'No Expiry Date'}
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Issuing Authority & Signatory
                  </span>
                  <span className="font-semibold text-slate-800 mt-1 block">
                    {document.candidateValues?.issuingAuthority || 'Statutory Authority'} •{' '}
                    {document.candidateValues?.signatoryDesignation || 'Authorized Signatory'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANOMALIES & AUDIT CHECKS */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700">
                  Deterministic Anomaly & Rule Check Findings
                </h4>
                <p className="text-[11px] text-slate-400">
                  Heuristic checks evaluated against AICTE Approval Process Handbook (APH)
                </p>
              </div>

              {document.anomalies && document.anomalies.length > 0 ? (
                <div className="space-y-2.5">
                  {document.anomalies.map((anom) => (
                    <div
                      key={anom.id}
                      className="p-4 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          {anom.type}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {anom.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">{anom.explanation}</p>
                      {anom.supportingFieldOrText && (
                        <p className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg">
                          Evidence: {anom.supportingFieldOrText}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                        <span>Detected: {anom.detectedAt}</span>
                        <span className="font-bold text-amber-600">{anom.reviewStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">No Issues Detected by Implemented Checks</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Cryptographic signature is valid, dates are within active bounds, and no duplicate hashes were detected.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VERIFICATION CHECKS & EVIDENCE */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Deterministic Statutory Verification Checks ({document.verificationChecks?.length || 0})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Transparent rule evaluation based on actual OCR content against AICTE APH norms
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF2FF] text-[#2563EB] border border-[#CFE2FE]">
                  <span>Status:</span>
                  <strong>{document.verificationStatus}</strong>
                </div>
              </div>

              {/* Checks List */}
              <div className="space-y-2.5">
                {document.verificationChecks && document.verificationChecks.length > 0 ? (
                  document.verificationChecks.map((chk) => (
                    <div
                      key={chk.id}
                      className={`p-4 rounded-2xl border bg-white shadow-xs space-y-2 ${
                        chk.result === 'FAIL'
                          ? 'border-rose-200 bg-rose-50/30'
                          : chk.result === 'WARNING'
                          ? 'border-amber-200 bg-amber-50/30'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              chk.result === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : chk.result === 'FAIL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : chk.result === 'WARNING'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {chk.result}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900">{chk.checkName}</h5>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{chk.timestamp}</span>
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                        <strong className="text-slate-500 block text-[10px] uppercase font-sans">Evidence / Observed Value:</strong>
                        <span>{chk.evidenceOrConflictingField}</span>
                      </div>

                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">Next Action:</span>
                        <span>{chk.recommendedNextAction}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No automated verification checks recorded.</p>
                )}
              </div>

              {/* Sub-evaluations: QR, Signature, Tampering */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                {/* QR Code Details */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">QR Verification</span>
                  <div className="font-semibold text-slate-800">
                    {document.qrVerification?.hasQrCode ? (
                      document.qrVerification.isDomainTrusted ? (
                        <span className="text-emerald-700 font-bold">Trusted Domain ({document.qrVerification.trustedDomainMatch})</span>
                      ) : (
                        <span className="text-amber-700 font-bold">Untrusted Domain</span>
                      )
                    ) : (
                      <span className="text-slate-500">No QR Code Payload</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {document.qrVerification?.details || 'Standard statutory document'}
                  </p>
                </div>

                {/* Digital Signature */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Digital Signature</span>
                  <div className="font-semibold text-slate-800">
                    {document.digitalSignature?.isSigned ? (
                      <span className="text-sky-700 font-bold">PKCS#7 Signed ({document.digitalSignature.signerName})</span>
                    ) : (
                      <span className="text-slate-500">Unsigned PDF / Physical Seal</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {document.digitalSignature?.authenticityDistinctionNote || 'Physical notary endorsement required.'}
                  </p>
                </div>

                {/* Tampering Indicators */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Metadata & Tampering</span>
                  <div className="font-semibold text-slate-800">
                    {document.tamperingIndicators?.hasSuspiciousMetadata ? (
                      <span className="text-rose-700 font-bold">{document.tamperingIndicators.editingSoftwareDetected || 'Suspicious Edit Markers'}</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">Clean Structure</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {document.tamperingIndicators?.disclaimer || 'Standard digital document.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span>Status: </span>
            <strong className="text-slate-800">{document.verificationStatus}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
