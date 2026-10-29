import React from 'react';
import { 
  Download, 
  Printer, 
  Building2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import type { ApplicationValidationReportItem } from '../../types/reportsAnalytics';

interface Report1ApplicationValidationProps {
  items: ApplicationValidationReportItem[];
  onExportCsv: () => void;
  onOpenPrintPreview: () => void;
}

export const Report1ApplicationValidation: React.FC<Report1ApplicationValidationProps> = ({
  items,
  onExportCsv,
  onOpenPrintPreview,
}) => {
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'RECOMMENDED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">RECOMMENDED</span>;
      case 'RECTIFICATION_PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">RECTIFICATION PENDING</span>;
      case 'INSPECTION_REQUIRED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">INSPECTION REQUIRED</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{verdict}</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Header & Export Actions */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Statutory Report 01
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Application-wise Validation & Scrutiny Report
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Comprehensive audit of institution applications, document counts, anomaly flags, and final recommendation verdicts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            type="button"
            onClick={onOpenPrintPreview}
            className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Printable PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Application & Institution</th>
              <th className="py-3 px-4">Region & Type</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Document Verification Progress</th>
              <th className="py-3 px-4">Compliance Score</th>
              <th className="py-3 px-4">Officer Status</th>
              <th className="py-3 px-4 text-right">Final Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item) => (
              <tr key={item.applicationId} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-[#102B4E]">{item.applicationId}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{item.institutionName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">ID: {item.institutionId}</div>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-semibold text-slate-800">{item.region}</span>
                  <div className="text-[10px] text-slate-500">{item.applicationType}</div>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  {item.submissionDate}
                </td>

                <td className="py-3 px-4 max-w-[180px]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span>{item.verifiedDocs} / {item.totalDocs} verified</span>
                    {item.flaggedAnomalies > 0 ? (
                      <span className="text-rose-600 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> {item.flaggedAnomalies} Flagged
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Clean
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.flaggedAnomalies > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${(item.verifiedDocs / item.totalDocs) * 100}%` }}
                    />
                  </div>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-sm font-black text-slate-900">{item.complianceScore}%</span>
                </td>

                <td className="py-3 px-4 max-w-[160px]">
                  <div className="text-[11px] text-slate-700 truncate" title={item.officerStatus}>
                    {item.officerStatus}
                  </div>
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  {getVerdictBadge(item.finalVerdict)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
