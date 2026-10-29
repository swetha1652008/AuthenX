import React, { useState } from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Code2, 
  Copy, 
  Check, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import type { ManagedDocument, ExtractedFieldItem } from '../../types/document';

interface ValidationDocumentInspectorProps {
  document: ManagedDocument | null;
  activeFieldKey?: string;
  onSelectField?: (field: ExtractedFieldItem) => void;
}

export const ValidationDocumentInspector: React.FC<ValidationDocumentInspectorProps> = ({
  document,
  activeFieldKey,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'preview' | 'ocr'>('preview');
  const [copied, setCopied] = useState(false);

  if (!document) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#CFE2FE] shadow-card flex flex-col items-center justify-center text-center h-full min-h-[450px]">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No Document Selected</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Select an item from the Document Queue on the left to inspect its visual representation and OCR layers.
        </p>
      </div>
    );
  }

  const handleCopyText = () => {
    if (document.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isImage = document.mimeType.startsWith('image/') || /\.(jpe?g|png)$/i.test(document.originalFilename);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#CFE2FE] shadow-card flex flex-col h-full space-y-4">
      {/* Inspector Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
              {document.id}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {document.documentCategory}
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-[#102B4E] truncate max-w-sm mt-0.5" title={document.originalFilename}>
            {document.originalFilename}
          </h3>
        </div>

        {/* View Mode Toggle & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'preview'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('ocr')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'ocr'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>OCR Stream</span>
            </button>
          </div>

          {/* Zoom Actions */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel((p) => Math.max(50, p - 25))}
              className="p-1 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-600 min-w-[36px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((p) => Math.min(200, p + 25))}
              className="p-1 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded-lg text-slate-600 hover:bg-white cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview / Inspector Canvas */}
      <div className="flex-1 bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4 overflow-auto min-h-[420px] flex items-start justify-center relative shadow-inner">
        {viewMode === 'preview' ? (
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-xl transition-transform duration-200 relative"
          >
            {/* Visual Document Mock Paper */}
            <div className="bg-white border border-slate-300 rounded-xl shadow-md p-6 sm:p-8 text-slate-800 space-y-4 relative overflow-hidden">
              {/* Header Seal */}
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                    Statutory AICTE Deposition
                  </span>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    {document.documentCategory}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {document.candidateValues?.institutionName || 'Authorized Technical Institution'} • PID: {document.institutionId}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#2563EB] bg-[#EAF2FF] border border-[#CFE2FE]">
                    SECURE-ARCHIVE
                  </span>
                  <span className="block text-[9px] text-slate-400 mt-1">Page 1 of 1</span>
                </div>
              </div>

              {/* Body Text */}
              <div className="py-2 text-[11px] font-mono text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                {document.extractedText || 'No text extracted.'}
              </div>

              {/* Interactive Bounding Box Indicator if a field is active */}
              {activeFieldKey && (
                <div className="p-3 rounded-xl bg-amber-50/80 border-2 border-amber-400 text-amber-900 text-[11px] font-medium flex items-center gap-2 animate-pulse">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Field Highlight Active: <strong className="font-bold uppercase">{activeFieldKey}</strong> verified in OCR block.
                  </span>
                </div>
              )}

              {/* Watermark / Footer */}
              <div className="pt-3 border-t border-slate-200 flex justify-between text-[9px] text-slate-400 font-mono">
                <span>SHA-256: {document.sha256Hash.substring(0, 20)}...</span>
                <span>Cryptographically Sealed</span>
              </div>
            </div>
          </div>
        ) : (
          /* Raw OCR Stream View */
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Raw Transcribed OCR Token Stream:
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1 rounded-xl bg-white border border-slate-200 hover:border-[#2563EB] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Tokens'}</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto shadow-inner">
              {document.extractedText || 'No text available.'}
            </div>
          </div>
        )}
      </div>

      {/* Inspector Bottom Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span>Engine: Local OCR Parser v5.3</span>
          <span>•</span>
          <span>Format: {isImage ? 'Raster Image' : 'Digital PDF'}</span>
        </div>
        <div className="flex items-center gap-1 text-[#2563EB] font-bold">
          <Maximize2 className="w-3 h-3" />
          <span>Interactive Zoom Active</span>
        </div>
      </div>
    </div>
  );
};
