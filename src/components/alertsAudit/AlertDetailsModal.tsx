import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MessageSquare, 
  Sparkles, 
  Send
} from 'lucide-react';
import type { SystemAlert, AlertStatus } from '../../types/alertsAudit';

interface AlertDetailsModalProps {
  alert: SystemAlert;
  onClose: () => void;
  onNavigateToModule: (section: string, param?: string) => void;
  onAddComment: (alertId: string, comment: string) => void;
  onUpdateStatus: (alertId: string, newStatus: AlertStatus, reason?: string) => void;
  onAssignOfficer: (alertId: string, officerName: string) => void;
}

export const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
  alert,
  onClose,
  onNavigateToModule,
  onAddComment,
  onUpdateStatus,
  onAssignOfficer,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionReason, setResolutionReason] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(alert.assignedOfficer || 'Dr. Ramesh Sharma (Compliance Officer)');

  const officers = [
    'Dr. Ramesh Sharma (Compliance Officer)',
    'Smt. Kavitha Nair (Verification Officer)',
    'Shri. Rajesh Verma (Senior Regional Officer)',
    'Security Administrator'
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(alert.id, commentText.trim());
    setCommentText('');
  };

  const handleResolveSubmit = () => {
    if (!resolutionReason.trim()) return;
    onUpdateStatus(alert.id, 'RESOLVED', resolutionReason.trim());
    setShowResolveDialog(false);
  };

  const isResolved = alert.status === 'RESOLVED' || alert.status === 'CLOSED';

  const getDeepLinkLabel = (section: string) => {
    switch (section) {
      case 'authentication':
        return 'Open Document Authentication & Anomaly Detection';
      case 'issuing-authority':
        return 'Open Issuing Authority Multi-Source Verification';
      case 'compliance':
        return 'Open Regulatory & Infrastructure Compliance';
      case 'human-review':
        return 'Open Human Review & Rectification Workspace';
      case 'officer-dashboard':
        return 'Open AICTE Officer Regulatory Dashboard';
      case 'documents':
        return 'Open Document Vault & Management';
      default:
        return 'Navigate to Associated Workspace';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 bg-[#102B4E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{alert.id}: {alert.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-200 mt-0.5">
                <span className="font-bold uppercase text-rose-300">{alert.severity} SEVERITY</span>
                <span>•</span>
                <span>Category: {alert.category.replace(/_/g, ' ')}</span>
                <span>•</span>
                <span className="text-amber-300">Status: {alert.status}</span>
              </div>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Institution & App Banner */}
          {alert.institutionName && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">{alert.institutionName}</div>
                  <div className="text-[11px] text-slate-500">
                    Application ID: <span className="font-semibold text-blue-600">{alert.applicationId}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Source Module</span>
                <span className="font-bold text-[#102B4E] text-xs">{alert.sourceModule.replace(/_/g, ' ')}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5">
            <span className="font-bold text-slate-800 text-xs block">Detailed Anomaly Description:</span>
            <p className="text-slate-600 leading-relaxed text-xs">{alert.description}</p>
          </div>

          {/* Recommended Regulatory Action */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3 text-blue-900">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs">Automated Regulatory Recommendation:</span>
              <p className="text-slate-700 text-xs leading-relaxed">{alert.recommendedAction}</p>
            </div>
          </div>

          {/* Deep Link Quick Jump Action */}
          {alert.deepLinkTarget && (
            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-indigo-900 text-xs">Direct Regulatory Module Deep-Link</span>
                <p className="text-[11px] text-slate-500">
                  Inspect the source evidence, OCR stream, or decision workflow directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigateToModule(alert.deepLinkTarget.section, alert.deepLinkTarget.param);
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <ExternalLink className="w-4 h-4" />
                {getDeepLinkLabel(alert.deepLinkTarget.section)}
              </button>
            </div>
          )}

          {/* Officer Assignment */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800 text-xs">Assign Officer for Investigation</span>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Current: <strong className="text-slate-800">{alert.assignedOfficer || 'Unassigned'}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none"
              >
                {officers.map((off) => (
                  <option key={off} value={off}>
                    {off}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onAssignOfficer(alert.id, selectedAssignee)}
                disabled={selectedAssignee === alert.assignedOfficer}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-semibold rounded-xl text-xs"
              >
                Update
              </button>
            </div>
          </div>

          {/* Timeline & Audit Events */}
          <div className="space-y-3">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Alert Investigation Timeline ({alert.timeline.length})
            </span>
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 divide-y divide-slate-200">
              {alert.timeline.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">{item.actor}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white border border-slate-200 text-slate-600">
                        {item.role}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.action}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {item.timestamp.replace('T', ' ').substring(0, 16)}
                    </span>
                  </div>
                  {item.comment && (
                    <p className="text-slate-600 text-[11px] leading-relaxed">{item.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="space-y-2">
            <label className="block text-slate-700 font-bold text-xs flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Add Investigation Note / Log Comment:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type note to append to alert audit history..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </div>
          </form>

          {/* Resolution Box if Resolved */}
          {alert.resolutionReason && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs">Resolution Justification (Recorded by {alert.resolvedBy}):</span>
                <p className="text-slate-700 text-xs mt-0.5">{alert.resolutionReason}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Resolved on: {alert.resolvedAt}</span>
              </div>
            </div>
          )}

          {/* Resolve Dialog */}
          {showResolveDialog && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-fade-in">
              <span className="font-bold text-emerald-900 text-xs block">
                Confirm Alert Resolution & Regulatory Justification:
              </span>
              <p className="text-[11px] text-slate-600">
                Provide official rationale for closing this alert. This justification will be permanently stored in the centralized audit log.
              </p>
              <textarea
                rows={2}
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                placeholder="e.g. Scrutinized original physical gazette notification with State Higher Education Department; anomaly cleared..."
                className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResolveDialog(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResolveSubmit}
                  disabled={!resolutionReason.trim()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-lg text-xs shadow-sm"
                >
                  Confirm & Resolve
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Alert Created: {alert.createdAt.split('T')[0]} • Last Updated: {alert.updatedAt.split('T')[0]}
          </div>

          <div className="flex items-center gap-2">
            {!isResolved && (
              <>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(alert.id, 'ESCALATED', 'Escalated by reviewing officer.')}
                  disabled={alert.status === 'ESCALATED'}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-800 border border-rose-300 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Escalate Alert
                </button>

                <button
                  type="button"
                  onClick={() => setShowResolveDialog(true)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Alert
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 hover:bg-white text-slate-700 font-semibold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
