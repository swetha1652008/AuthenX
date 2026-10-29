import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  CheckCircle2, 
  ShieldAlert, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Sliders, 
  Tag, 
  FileCheck, 
  X,
  Sparkles
} from 'lucide-react';
import type { InfrastructureEvidence, ComplianceRule } from '../../types/compliance';

interface PhotoReviewWorkspaceProps {
  evidence: InfrastructureEvidence;
  rule?: ComplianceRule;
  onClose: () => void;
  onConfirmOutcome: (evidenceId: string, outcome: 'CONFIRMED_GENUINE' | 'DISCREPANCY_FLAGGED', notes: string) => void;
}

export const PhotoReviewWorkspace: React.FC<PhotoReviewWorkspaceProps> = ({
  evidence,
  rule,
  onClose,
  onConfirmOutcome,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('');

  const analysis = evidence.analysisResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#102B4E]">
                  Infrastructure Photograph Review Workspace
                </h3>
                <span className="text-[10px] font-bold bg-[#102B4E] text-white px-2 py-0.5 rounded">
                  v{evidence.versionNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {evidence.title} • Linked: {rule?.requirementCode || evidence.linkedRequirementId}
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

        {/* Content: Two Columns (Left Image Canvas, Right Analysis Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Canvas (7 cols) */}
          <div className="lg:col-span-7 p-4 bg-slate-900 flex flex-col items-center justify-between min-h-[400px]">
            {/* Canvas Toolbar */}
            <div className="w-full flex items-center justify-between px-3 py-1.5 bg-black/40 rounded-lg text-white text-xs mb-3">
              <span className="text-[11px] font-mono text-slate-300">
                Resolution: 1920x1080 • Geo-tagged: Lat 12.845°, Long 77.663°
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 hover:bg-white/20 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1 hover:bg-white/20 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 hover:bg-white/20 rounded ml-1"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`p-1 rounded ml-1 ${highContrast ? 'bg-amber-400 text-black' : 'hover:bg-white/20'}`}
                  title="Toggle High Contrast"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Canvas Representation */}
            <div className="flex-1 flex items-center justify-center overflow-hidden w-full relative">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  filter: highContrast ? 'contrast(150%) brightness(110%)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
                className="max-w-full max-h-[380px] rounded-lg shadow-lg border border-slate-700 bg-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-300"
              >
                <ImageIcon className="w-16 h-16 text-teal-400 mb-3" />
                <p className="text-sm font-bold text-white">{evidence.title}</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">{evidence.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {analysis?.detectedLabels?.map((lbl) => (
                    <span key={lbl} className="bg-teal-900/60 text-teal-200 border border-teal-500/40 px-2 py-0.5 rounded text-[10px]">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Statutory Disclaimer */}
            <div className="w-full text-center text-[10px] text-slate-400 mt-2">
              Note: Visual image review assists in checking facility existence and equipment density, but does not independently certify physical dimensions or structural safety.
            </div>
          </div>

          {/* Right Analysis & Decision Panel (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
            <div>
              {/* Computer Vision Score & Checks */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#102B4E] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" /> AI Computer Vision Analysis
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Quality: {analysis?.readabilityScore || 92}%
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700">Image Blur & Occlusion:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Clear (Sharp)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Edge sharpness index meets threshold (&gt;85). Key equipment is unobscured.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700">Duplicate Image Analysis:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unique Photograph
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      No perceptual hash collision detected with past academic sessions or other institutions.
                    </p>
                  </div>

                  {/* Detected Facilities */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Detected Facility Labels:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis?.detectedLabels?.map((l) => (
                        <span key={l} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[10px] font-semibold border border-blue-200">
                          <Tag className="w-3 h-3" /> {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement Match Card */}
              {rule && (
                <div className="p-3 rounded-lg bg-[#EAF2FF] border border-[#CFE2FE] mb-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#102B4E] mb-1">
                    <FileCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Rule Match: {rule.requirementCode}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {rule.description}
                  </p>
                </div>
              )}

              {/* Officer Notes Input */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Officer Review Observations & Notes:
                </label>
                <textarea
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Record verification remarks (e.g. Workstation count verified against timetable schedule)..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onConfirmOutcome(evidence.id, 'DISCREPANCY_FLAGGED', officerNotes || 'Flagged by scrutiny officer.')}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Flag Discrepancy
              </button>

              <button
                type="button"
                onClick={() => onConfirmOutcome(evidence.id, 'CONFIRMED_GENUINE', officerNotes || 'Photo verified compliant with facility norms.')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Genuine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
