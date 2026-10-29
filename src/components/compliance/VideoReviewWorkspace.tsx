import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Film, 
  Info, 
  X,
  FileCheck
} from 'lucide-react';
import type { InfrastructureEvidence, ComplianceRule } from '../../types/compliance';

interface VideoReviewWorkspaceProps {
  evidence: InfrastructureEvidence;
  rule?: ComplianceRule;
  onClose: () => void;
  onConfirmOutcome: (evidenceId: string, outcome: 'CONFIRMED_GENUINE' | 'DISCREPANCY_FLAGGED', notes: string) => void;
}

export const VideoReviewWorkspace: React.FC<VideoReviewWorkspaceProps> = ({
  evidence,
  rule,
  onClose,
  onConfirmOutcome,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [officerNotes, setOfficerNotes] = useState('');

  const sampleFrames = [
    {
      timestamp: '00:04',
      label: 'Main Academic Block Entrance & Wheelchair Ramp',
      detected: ['Wheelchair Ramp (Gradient 1:12)', 'Double Width Glass Door', 'Tactile Paving'],
      observation: 'Clear entry path conforming to barrier-free norms.',
    },
    {
      timestamp: '00:15',
      label: 'Computer Science Department Lab 201',
      detected: ['Desktop Computers (35 visible)', 'Ceiling Mounted Projector', 'Emergency Exit Sign'],
      observation: 'Adequate workstation spacing observed.',
    },
    {
      timestamp: '00:30',
      label: 'Central Library Reading Hall & Reference Stacks',
      detected: ['Book Stacks (6 rows)', 'Reading Tables (80 capacity)', 'RFID Security Gate'],
      observation: 'Stack area matches declared carpet area in blueprint.',
    },
    {
      timestamp: '00:45',
      label: 'Seminar Hall & Audio-Visual Systems',
      detected: ['Acoustic Wall Paneling', 'Dual Microphone Podium', 'Seating Rows'],
      observation: 'Proper safety exits visible on left perimeter.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#102B4E]">
                  Infrastructure Video Walkthrough Review Workspace
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Player Area (7 cols) */}
          <div className="lg:col-span-7 p-4 bg-slate-950 flex flex-col justify-between">
            {/* Video Viewport Mock */}
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-white">
              <Film className="w-16 h-16 text-purple-400/80 mb-3" />
              <p className="text-sm font-bold">{evidence.title}</p>
              <p className="text-xs text-slate-400 mt-1">
                Duration: 01:24 • Codec: H.264/AAC • Bitrate: 4.2 Mbps
              </p>

              {/* Play Overlay */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="mt-4 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs p-2 rounded-lg flex items-center justify-between text-[11px] font-mono">
                <span>{isPlaying ? '00:15 / 01:24 [PLAYING]' : '00:00 / 01:24 [PAUSED]'}</span>
                <span className="text-purple-300">Keyframe Sample #{selectedFrameIndex + 1}</span>
              </div>
            </div>

            {/* Extracted Keyframe Timeline */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Keyframe Extraction Timeline (Selected Intervals)
                </span>
                <span className="text-[11px] text-slate-400">4 Frames Sampled</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {sampleFrames.map((frame, idx) => (
                  <button
                    key={frame.timestamp}
                    type="button"
                    onClick={() => setSelectedFrameIndex(idx)}
                    className={`p-2 rounded-lg border text-left transition ${
                      selectedFrameIndex === idx
                        ? 'bg-purple-900/60 border-purple-400 text-white ring-1 ring-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block text-purple-400">
                      {frame.timestamp}
                    </span>
                    <span className="text-[10px] line-clamp-1 block font-medium mt-0.5">
                      {frame.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Statutory Disclosure */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Truth in Processing Disclosure:</strong> Automated computer vision processed selected sample keyframes (timestamps 00:04, 00:15, 00:30, 00:45). Full continuous video review must be performed by the assigned scrutiny officer prior to granting regulatory approval.
              </span>
            </div>
          </div>

          {/* Right Inspection & Notes Panel (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
            <div>
              {/* Active Keyframe Details */}
              <div className="mb-4">
                <span className="text-xs font-bold text-[#102B4E] uppercase tracking-wider block mb-2">
                  Active Keyframe AI Inspection ({sampleFrames[selectedFrameIndex].timestamp})
                </span>

                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-slate-900">
                    {sampleFrames[selectedFrameIndex].label}
                  </p>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Detected Objects & Infrastructure:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sampleFrames[selectedFrameIndex].detected.map((obj) => (
                        <span key={obj} className="px-2 py-0.5 rounded bg-white text-purple-800 text-[10px] font-semibold border border-purple-200 shadow-2xs">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 italic">
                    AI Observation: {sampleFrames[selectedFrameIndex].observation}
                  </p>
                </div>
              </div>

              {/* Regulatory Requirement Link */}
              {rule && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#102B4E] mb-1">
                    <FileCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Rule Reference: {rule.requirementCode}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{rule.title}</p>
                </div>
              )}

              {/* Officer Notes */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Officer Review Observations:
                </label>
                <textarea
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="Record verification notes (e.g. Ramp gradient visually conforms to barrier-free slope)..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onConfirmOutcome(evidence.id, 'DISCREPANCY_FLAGGED', officerNotes || 'Video indicates potential discrepancy.')}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Flag Discrepancy
              </button>

              <button
                type="button"
                onClick={() => onConfirmOutcome(evidence.id, 'CONFIRMED_GENUINE', officerNotes || 'Video walkthrough confirmed facility presence.')}
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
