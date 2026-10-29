import React from 'react';
import { 
  Download, 
  Printer 
} from 'lucide-react';
import type { RegulatoryComplianceReportItem } from '../../types/reportsAnalytics';

interface Report2RegulatoryComplianceProps {
  items: RegulatoryComplianceReportItem[];
  onExportCsv: () => void;
  onOpenPrintPreview: () => void;
}

export const Report2RegulatoryCompliance: React.FC<Report2RegulatoryComplianceProps> = ({
  items,
  onExportCsv,
  onOpenPrintPreview,
}) => {
  const getStateBadge = (state: string) => {
    switch (state) {
      case 'FULL_COMPLIANCE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">FULL COMPLIANCE</span>;
      case 'MINOR_DEFICIT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">MINOR DEFICIT</span>;
      case 'MAJOR_DEFICIT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">MAJOR DEFICIT</span>;
      case 'UNDER_VERIFICATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">UNDER VERIFICATION</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{state}</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Header & Export Actions */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Statutory Report 02
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Regulatory Compliance Summary & Deficit Gap Analysis
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Audit of statutory norms, claimed vs verified capacities, carpet area deficits, and faculty cadre shortfalls.
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
              <th className="py-3 px-4">Institution & Application</th>
              <th className="py-3 px-4">Regulatory Category</th>
              <th className="py-3 px-4">Mandated Norm vs Verified</th>
              <th className="py-3 px-4">Deficit / Gap Analysis</th>
              <th className="py-3 px-4">Compliance Status</th>
              <th className="py-3 px-4 text-right">Officer Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#102B4E]">{item.institutionName}</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5">{item.applicationId}</div>
                  <div className="text-[10px] text-slate-400">ID: {item.institutionId}</div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-3.5 px-4 max-w-[220px]">
                  <div className="text-[11px] font-bold text-slate-800">Norm: {item.requiredNorm}</div>
                  <div className="text-[11px] text-slate-600 mt-1">Verified: {item.verifiedCapacity}</div>
                  <div className="text-[10px] text-slate-400">Claimed: {item.claimedCapacity}</div>
                </td>

                <td className="py-3.5 px-4 max-w-[220px]">
                  <div className="font-bold text-rose-700 text-[11px]">{item.deficitGap}</div>
                  <p className="text-[10px] text-slate-500 mt-0.5" title={item.aiFinding}>
                    {item.aiFinding}
                  </p>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStateBadge(item.complianceState)}
                </td>

                <td className="py-3.5 px-4 text-right max-w-[200px]">
                  <span className="text-[11px] text-slate-800 font-medium">
                    {item.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
