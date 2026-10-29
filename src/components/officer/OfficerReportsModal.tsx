import React from 'react';
import { 
  Download, 
  Printer, 
  X, 
  FileText
} from 'lucide-react';
import { officerDashboardService } from '../../services/officerDashboardService';

interface OfficerReportsModalProps {
  onClose: () => void;
}

export const OfficerReportsModal: React.FC<OfficerReportsModalProps> = ({ onClose }) => {
  const workload = officerDashboardService.getWorkloadStats();
  const attention = officerDashboardService.getComplianceAttentionStats();
  const queue = officerDashboardService.getPriorityReviewQueue();

  const handleDownloadCSV = () => {
    const csv = officerDashboardService.exportApplicationsToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AuthenX_AICTE_Officer_Regulatory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                AICTE Officer Executive Regulatory Report
              </h3>
              <p className="text-xs text-slate-500">
                Official institutional application scrutiny summary for Academic Year 2026-2027.
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Total Applications</span>
              <span className="text-xl font-black text-[#102B4E]">{workload.totalApplications}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[11px] text-emerald-700 font-medium block">Validation Completed</span>
              <span className="text-xl font-black text-emerald-800">{workload.validationCompleted}</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[11px] text-amber-700 font-medium block">Validation Pending</span>
              <span className="text-xl font-black text-amber-800">{workload.validationPending}</span>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[11px] text-rose-700 font-medium block">Unresolved Gaps</span>
              <span className="text-xl font-black text-rose-800">{attention.unresolvedDiscrepanciesCount}</span>
            </div>
          </div>

          {/* Attention Summary List */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <h4 className="font-bold text-[#102B4E] text-xs uppercase tracking-wider mb-2">
              Statutory Scrutiny Highlights
            </h4>
            <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
              <span>Applications with Missing Mandatory Documents:</span>
              <span className="font-bold font-mono">{attention.missingDocumentsCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
              <span>Applications with Unresolved Discrepancies:</span>
              <span className="font-bold font-mono text-rose-600">{attention.unresolvedDiscrepanciesCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
              <span>Applications Currently in Officer Review Queue:</span>
              <span className="font-bold font-mono text-blue-600">{attention.applicationsRequiringReviewCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 py-1">
              <span>Expired Supporting Approvals / Certificates:</span>
              <span className="font-bold font-mono text-purple-600">{attention.expiredDocumentsCount}</span>
            </div>
          </div>

          {/* Priority Queue Snippet */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="font-bold text-[#102B4E] text-xs uppercase tracking-wider mb-2">
              Current High-Priority Scrutiny Cases ({queue.length})
            </h4>
            <div className="space-y-2">
              {queue.map((item) => (
                <div key={item.id} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#2563EB]">{item.applicationId}</span>
                    <span className="text-slate-700 font-semibold block text-xs">{item.institutionName}</span>
                    <span className="text-[11px] text-slate-500">{item.issue}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Summary
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="px-4 py-2 font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>
    </div>
  );
};
