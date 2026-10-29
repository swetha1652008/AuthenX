import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldAlert, 
  Building2, 
  Calendar, 
  FileText, 
  Hash, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import type { AnomalyAuditReport } from '../../types/anomaly';

interface AnomalyReportModalProps {
  report: AnomalyAuditReport;
  onClose: () => void;
  onDownload: () => void;
}

export const AnomalyReportModal: React.FC<AnomalyReportModalProps> = ({
  report,
  onClose,
  onDownload,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="report-modal-title"
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-sm text-[#102B4E]">
              Anomaly & Document Authentication Audit Report
            </span>
            <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
              {report.reportId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-0 print:overflow-visible">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#102B4E] pb-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-[#102B4E] text-white font-black flex items-center justify-center text-xs">
                AX
              </span>
              <span className="text-lg font-black tracking-tight text-[#102B4E]">
                AUTHENX REGULATORY VERIFICATION SUITE
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Technical Education Quality & Compliance Directorate
            </p>
            <h1 id="report-modal-title" className="text-xl font-extrabold text-[#102B4E] mt-3">
              STATUTORY DOCUMENT AUTHENTICATION & ANOMALY AUDIT LEDGER
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic Hash Verification • Jaccard Content Similarity • Chronological & Metadata Evaluation
            </p>
          </div>

          {/* Institutional Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Application ID:</span>
              <span className="font-bold text-[#102B4E] font-mono">{report.applicationId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Institution ID:</span>
              <span className="font-bold text-[#102B4E] font-mono">{report.institutionId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Academic Year:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {report.academicYear}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">Generated At:</span>
              <span className="font-medium text-slate-700">
                {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>
            <div className="col-span-2 md:col-span-4 border-t border-slate-200 pt-2 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold text-slate-800">{report.institutionName}</span>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div>
            <h2 className="text-sm font-bold text-[#102B4E] uppercase tracking-wider mb-3">
              1. Anomaly & Duplicate Metrics Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-xs text-slate-500 block">Total Documents</span>
                <span className="text-xl font-black text-[#102B4E]">{report.metrics.documentsAnalyzed}</span>
              </div>
              <div className="p-3 rounded-lg border border-red-200 bg-red-50/40">
                <span className="text-xs text-red-700 font-medium block">Exact Byte Matches</span>
                <span className="text-xl font-black text-red-700">{report.metrics.exactDuplicateMatches}</span>
              </div>
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/40">
                <span className="text-xs text-amber-700 font-medium block">Possible Duplicates</span>
                <span className="text-xl font-black text-amber-700">{report.metrics.possibleDuplicateCandidates}</span>
              </div>
              <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/40">
                <span className="text-xs text-purple-700 font-medium block">Date Inconsistencies</span>
                <span className="text-xl font-black text-purple-700">{report.metrics.dateInconsistencies}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Digest Ledger */}
          <div>
            <h2 className="text-sm font-bold text-[#102B4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-teal-600" />
              2. Cryptographic Integrity & SHA-256 Digest Ledger
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Statutory Category</th>
                    <th className="py-2.5 px-3">SHA-256 Checksum</th>
                    <th className="py-2.5 px-3 text-right">Identifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {report.analyzedDocumentList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[200px]" title={item.name}>{item.name}</span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-600">
                        {item.category}
                      </td>
                      <td className="py-2 px-3 text-slate-700 text-[10px] truncate max-w-[280px]" title={item.sha256}>
                        {item.sha256}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[10px] text-slate-400">
                        {item.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Flagged Anomaly & Review Ledger */}
          <div>
            <h2 className="text-sm font-bold text-[#102B4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              3. Detected Anomaly Ledger & Audit Status
            </h2>
            {report.alerts.length === 0 ? (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>No anomalies or duplicates detected across all analyzed documents.</span>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3">Alert ID</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Document</th>
                      <th className="py-2.5 px-3">Detection Rule & Finding</th>
                      <th className="py-2.5 px-3">Review Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.alerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-slate-50 text-[11px]">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {alert.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {alert.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 max-w-[160px] truncate" title={alert.documentName}>
                          {alert.documentName}
                          {alert.comparedDocumentName && (
                            <span className="block text-[10px] text-slate-400 truncate">
                              vs. {alert.comparedDocumentName}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 max-w-[280px]">
                          <span className="font-bold text-slate-800 block text-xs">{alert.detectionRule}</span>
                          <span className="text-slate-600 text-xs">{alert.explanation}</span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-bold text-slate-700 block text-[10px]">
                            {alert.reviewStatus}
                          </span>
                          {alert.assignedReviewer && (
                            <span className="text-[10px] text-slate-400 block">
                              By {alert.assignedReviewer}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Statutory Sign-off & Disclaimer Notice */}
          <div className="border-t border-slate-200 pt-5 text-[11px] text-slate-500 space-y-2">
            <p>
              <strong>Notice:</strong> This document audit report is generated algorithmically by the AuthenX Document Verification Engine (v2.4 Demo Mode). Inferences reflect automated pattern detection and cryptographic digest comparisons.
            </p>
            <p>
              Final regulatory approval decisions remain strictly under the jurisdiction of the statutory Scrutiny Committee of the All India Council for Technical Education (AICTE).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
