import React, { useState } from 'react';
import { 
  FileCode2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Layers, 
  CheckCircle2, 
  ShieldAlert, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { InfrastructureEvidence, ComplianceRule } from '../../types/compliance';

interface FloorPlanReviewWorkspaceProps {
  evidence: InfrastructureEvidence;
  rule?: ComplianceRule;
  onClose: () => void;
  onConfirmOutcome: (evidenceId: string, outcome: 'CONFIRMED_GENUINE' | 'DISCREPANCY_FLAGGED', notes: string) => void;
}

export const FloorPlanReviewWorkspace: React.FC<FloorPlanReviewWorkspaceProps> = ({
  evidence,
  rule,
  onClose,
  onConfirmOutcome,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [officerNotes, setOfficerNotes] = useState('');

  const extractedRooms = [
    { label: 'Classrooms 101-112 (Block A)', dimensions: '8.5m x 8.0m', areaSqm: 68.0, minNormSqm: 66.0, status: 'Compliant' },
    { label: 'Computer Center & AI Lab (Room 204)', dimensions: '12.0m x 8.5m', areaSqm: 102.0, minNormSqm: 66.0, status: 'Compliant' },
    { label: 'Central Library Stack & Reading Room', dimensions: '22.0m x 18.0m', areaSqm: 396.0, minNormSqm: 400.0, status: 'Minor Deficit (1%)' },
    { label: 'Seminar Hall (Ground Floor)', dimensions: '15.0m x 12.0m', areaSqm: 180.0, minNormSqm: 132.0, status: 'Compliant' },
    { label: 'Mechanical Workshop Bay 1-2', dimensions: '20.0m x 10.0m', areaSqm: 200.0, minNormSqm: 200.0, status: 'Compliant' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#102B4E]">
                  Architectural Floor Plan & Blueprint Review Workspace
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

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Blueprint Canvas (7 cols) */}
          <div className="lg:col-span-7 p-4 bg-slate-900 flex flex-col justify-between min-h-[420px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/50 rounded-lg text-white text-xs mb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono">Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 hover:bg-white/20 rounded ml-1"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Blueprint Mock Render */}
            <div className="flex-1 flex items-center justify-center overflow-hidden w-full relative">
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                }}
                className="max-w-full max-h-[360px] p-6 bg-slate-800 border-2 border-indigo-400/40 rounded-xl flex flex-col items-center justify-center text-center text-slate-300 shadow-xl"
              >
                <Layers className="w-16 h-16 text-indigo-400 mb-3" />
                <p className="text-sm font-bold text-white">Sanctioned Floor Blueprint — Sheet #{currentPage}</p>
                <p className="text-xs text-indigo-300 mt-1">Scale 1:100 • Municipal Seal: BBMP/OC-2025/941</p>
                <div className="mt-4 p-3 bg-slate-900/80 rounded-lg text-[10px] text-left font-mono space-y-1">
                  <div>• [ROOM 101-112]: 12 CLASSROOMS (68 SQM EA)</div>
                  <div>• [ROOM 204]: ARTIFICIAL INTELLIGENCE LAB (102 SQM)</div>
                  <div>• [GROUND FLOOR]: CENTRAL LIBRARY (396 SQM)</div>
                  <div>• [BLOCK B]: AUDITORIUM & SEMINAR HALL (180 SQM)</div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-2 text-center text-[10px] text-slate-400">
              Extracted dimensions are calculated via OCR boundary detection. Final carpet area must be confirmed via the authorized municipal occupancy permit.
            </div>
          </div>

          {/* Right Column: OCR Extraction & Norms Comparison (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
            <div>
              <span className="text-xs font-bold text-[#102B4E] uppercase tracking-wider block mb-2">
                Extracted Room Schedule vs. AICTE Norms
              </span>

              {/* Table of Rooms */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="py-2 px-2.5">Room / Facility</th>
                      <th className="py-2 px-2 text-center">Extracted Area</th>
                      <th className="py-2 px-2 text-center">AICTE Norm</th>
                      <th className="py-2 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {extractedRooms.map((rm) => (
                      <tr key={rm.label} className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 font-medium text-slate-800">{rm.label}</td>
                        <td className="py-2 px-2 text-center font-mono">{rm.areaSqm} m²</td>
                        <td className="py-2 px-2 text-center font-mono text-slate-500">{rm.minNormSqm} m²</td>
                        <td className="py-2 px-2 text-right">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              rm.status === 'Compliant'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rm.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Instructional Area Summary */}
              <div className="p-3 rounded-lg bg-[#EAF2FF] border border-[#CFE2FE] mb-4 text-xs">
                <div className="flex items-center justify-between font-bold text-[#102B4E] mb-1">
                  <span>Total Extracted Instructional Area:</span>
                  <span className="text-[#2563EB] font-mono text-sm">14,800 m²</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>AICTE APH Minimum Norm (564 Intake):</span>
                  <span className="font-mono">12,500 m² (Surplus +2,300 m²)</span>
                </div>
              </div>

              {/* Officer Notes */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Officer Floor-Plan Remarks:
                </label>
                <textarea
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Record architectural verification notes (e.g. Dimensions verify sanctioned master layout)..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onConfirmOutcome(evidence.id, 'DISCREPANCY_FLAGGED', officerNotes || 'Blueprint area discrepancy flagged.')}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Flag Discrepancy
              </button>

              <button
                type="button"
                onClick={() => onConfirmOutcome(evidence.id, 'CONFIRMED_GENUINE', officerNotes || 'Sanctioned blueprint carpet area verified compliant.')}
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
