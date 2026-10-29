import React, { useState } from 'react';
import { 
  X, 
  Printer 
} from 'lucide-react';
import type { StatutoryReportType, ReportFilterOptions } from '../../types/reportsAnalytics';

interface ReportPrintPreviewModalProps {
  reportType: StatutoryReportType;
  filters: ReportFilterOptions;
  onClose: () => void;
  reportTitle: string;
  reportDataRows: Array<Record<string, string | number>>;
}

export const ReportPrintPreviewModal: React.FC<ReportPrintPreviewModalProps> = ({
  reportType: _reportType,
  filters,
  onClose,
  reportTitle,
  reportDataRows,
}) => {
  const [serialNumber] = useState(() => `AICTE/APH/2026-27/SEC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [generationTimestamp] = useState(() => new Date().toISOString().replace('T', ' ').substring(0, 19));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-xs print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-[#102B4E] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-sm">Official Statutory Print / PDF Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 font-serif print:overflow-visible">
          {/* AICTE Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600 font-sans">
              Government of India • Ministry of Education
            </div>
            <h2 className="text-xl font-black uppercase text-[#102B4E] tracking-tight font-sans">
              All India Council for Technical Education (AICTE)
            </h2>
            <div className="text-xs font-semibold text-slate-700 font-sans">
              Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
            </div>
            <div className="text-[11px] font-bold text-blue-900 bg-blue-50/70 border border-blue-200 py-1 px-3 rounded-md inline-block mt-2 font-sans">
              AuthenX™ AI-Powered Regulatory Scrutiny & Compliance Verification System
            </div>
          </div>

          {/* Report Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Statutory Report Title:</span>
              <strong className="text-sm font-black text-slate-900">{reportTitle}</strong>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Academic Year: <span className="font-bold">{filters.academicYear}</span> • Region: <span className="font-bold">{filters.region}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Dispatch Reference Code:</span>
              <span className="font-mono font-bold text-slate-900">{serialNumber}</span>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Generated: {generationTimestamp} UTC
              </div>
            </div>
          </div>

          {/* Formatted Data Table */}
          <div className="font-sans">
            <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[9px] border-b border-slate-300">
                <tr>
                  {reportDataRows.length > 0 &&
                    Object.keys(reportDataRows[0]).map((colKey) => (
                      <th key={colKey} className="p-2 border border-slate-300">
                        {colKey.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportDataRows.map((row, idx) => (
                  <tr key={idx} className="even:bg-slate-50/50">
                    {Object.values(row).map((val, cellIdx) => (
                      <td key={cellIdx} className="p-2 border border-slate-300">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Regulatory Certification & Sign-off Block */}
          <div className="pt-6 border-t-2 border-slate-900 font-sans grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <span className="font-bold text-slate-900 block text-xs">
                Scrutiny Verification Officer:
              </span>
              <div className="h-12 border-b border-dashed border-slate-400" />
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Name: Dr. Ramesh Sharma</div>
                <div>Designation: Authorized Scrutiny Officer, AICTE</div>
                <div>Date: ________________________</div>
              </div>
            </div>

            <div className="space-y-4 text-right">
              <span className="font-bold text-slate-900 block text-xs">
                Approval Committee Recommendation:
              </span>
              <div className="h-12 border-b border-dashed border-slate-400" />
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Senior Regional Officer / Chairman</div>
                <div>AICTE Approval Process Handbook Committee</div>
                <div>Official Seal & Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
