import { X, Printer, Download, FileText } from 'lucide-react';
import { finalReviewService } from '../../services/finalReviewService';

interface Props {
  appId: string;
  onClose: () => void;
}

export const ScrutinyReportExportModal: React.FC<Props> = ({ appId, onClose }) => {
  const details = finalReviewService.getApplicationScrutinyDetails(appId);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csv = finalReviewService.exportScrutinyReportCsv(appId);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AICTE_Scrutiny_Report_${appId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E]">
                Executive Scrutiny Dossier: {details.app.id}
              </h3>
              <p className="text-xs text-slate-500">
                Official AICTE Approval Process Handbook (APH 2026-27) Statutory Record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-slate-800 print:p-0">
          {/* Header Strip */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-lg font-black text-[#102B4E] uppercase tracking-tight">
                All India Council for Technical Education
              </h1>
              <h2 className="text-xs font-bold text-slate-600">
                Regulatory Scrutiny & Statutory Compliance Dossier
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Generated via AuthenX Decision Support Engine • Academic Year {details.app.academicYear}
              </p>
            </div>
            <div className="text-right font-mono text-[11px]">
              <div><strong>Ref:</strong> {details.app.id}</div>
              <div><strong>Scope:</strong> {details.app.type}</div>
              <div><strong>Date:</strong> {new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          {/* Campus Profile */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Institution Name</span>
              <div className="font-bold text-slate-900 text-sm">{details.app.institution?.name}</div>
              <div className="text-[11px] text-slate-500">{details.app.institution?.fullAddress}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Permanent AICTE & AISHE ID</span>
              <div className="font-mono font-bold text-slate-900">{details.app.institutionId} / {details.app.institution?.aisheCode}</div>
              <div className="text-[11px] text-slate-500">{details.app.institution?.authorizedRepresentative}</div>
            </div>
          </div>

          {/* Findings & Compliance Summary */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Multi-Source Verification & Discrepancies Summary
            </h4>
            <div className="space-y-2">
              <div>
                <strong>Submitted Documents:</strong> {details.app.documents.length} verified statutory items on file.
              </div>
              <div>
                <strong>Active Discrepancies:</strong> {details.discrepancies.length} recorded cross-module findings.
              </div>
              {details.discrepancies.map((d, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px]">
                  <strong>[{d.severity}] {d.fieldName}:</strong> {d.explanation}
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Scrutiny Committee Observations
            </h4>
            <div className="space-y-1.5">
              {details.observations.map((o, i) => (
                <div key={i} className="text-[11px]">
                  • <strong>{o.requirementOrField} ({o.severity}):</strong> {o.officerNotes}
                </div>
              ))}
            </div>
          </div>

          {/* Decision Record */}
          {details.decisionRecord && (
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-xs text-slate-900">
                  Authorized Scrutiny Outcome:
                </span>
                <span className="font-mono font-bold text-xs">
                  {details.decisionRecord.outcome.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs italic text-slate-700">
                "{details.decisionRecord.remarks}"
              </p>
              <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                <span>Decision Maker: <strong>{details.decisionRecord.decisionMaker}</strong></span>
                <span>Timestamp: {details.decisionRecord.decisionTimestamp}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-[#102B4E] hover:bg-[#1d4ed8] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
