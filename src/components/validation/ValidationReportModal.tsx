import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import type { ValidationReport } from '../../types/document';

interface ValidationReportModalProps {
  report: ValidationReport | null;
  onClose: () => void;
  onDownload: () => void;
}

export const ValidationReportModal: React.FC<ValidationReportModalProps> = ({
  report,
  onClose,
  onDownload,
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
                  {report.id}
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Demo Audit Report
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#102B4E] mt-0.5">
                AI Regulatory Validation & Compliance Report
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="p-2 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              title="Download JSON Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-xs bg-[#F8FAFC]">
          {/* Statutory Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-[#CFE2FE] text-[#102B4E] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-[#2563EB]">
              <Sparkles className="w-4 h-4" />
              <span>AICTE Decision-Support Prototype Notice</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              This report represents preliminary machine-assisted validation evaluated against normative rules. Final decision and accreditation certification are strictly governed by competent AICTE statutory authorities.
            </p>
          </div>

          {/* Report Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Application ID</span>
              <span className="font-mono font-bold text-[#2563EB]">{report.applicationId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Document Name</span>
              <span className="font-bold text-slate-900 truncate block">{report.documentName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ruleset Version</span>
              <span className="font-semibold text-slate-800">{report.rulesetVersion}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluation Timestamp</span>
              <span className="font-semibold text-slate-800">{report.processingTimestamp}</span>
            </div>
          </div>

          {/* Section 1: Classification & OCR Metadata */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-[#102B4E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              1. Document Classification & OCR Ingestion Engine
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">Assigned Category:</span>
                <strong className="text-slate-900 block mt-0.5">{report.classificationResult.category}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">Classification Confidence:</span>
                <strong className="text-emerald-700 block mt-0.5">
                  {Math.round(report.classificationResult.confidence * 100)}% ({report.classificationResult.method})
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">OCR Parser State:</span>
                <strong className="text-slate-900 block mt-0.5">{report.ocrStatus} ({report.ocrEngine})</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Extracted Field Attributes Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-[#102B4E] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              2. Mandatory Field Extractions & Validation Bounds
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-slate-200 font-bold text-slate-600 text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Field Name</th>
                    <th className="p-2.5">Extracted Value</th>
                    <th className="p-2.5">Confidence</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Evidence Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {report.extractedFields.map((fld) => (
                    <tr key={fld.id}>
                      <td className="p-2.5 font-bold text-slate-800">{fld.fieldName}</td>
                      <td className="p-2.5 font-mono text-slate-700">{fld.extractedValue}</td>
                      <td className="p-2.5 font-mono text-slate-500">{Math.round(fld.confidence * 100)}%</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fld.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {fld.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 italic">{fld.evidenceSnippet || 'Page 1 OCR stream'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Date Validity Analysis */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-[#102B4E] flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              3. Chronological & Expiry Date Verification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {report.dateFindings.map((df) => (
                <div key={df.fieldKey} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{df.label}</span>
                    <span className="font-mono font-bold text-slate-900">{df.parsedIsoDate || df.rawDateStr}</span>
                  </div>
                  <p className="text-slate-600 text-[10px]">{df.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Anomaly Findings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-[#102B4E] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              4. Deterministic Anomaly Audit Findings ({report.alerts.length})
            </h4>
            {report.alerts.length > 0 ? (
              <div className="space-y-2">
                {report.alerts.map((alert) => (
                  <div key={alert.id} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-900">{alert.type}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{alert.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-[11px] italic">No active anomalies detected for this file.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span>Decision: </span>
            <strong className="text-slate-800">{report.manualReviewDecision || 'Pending Review'}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
