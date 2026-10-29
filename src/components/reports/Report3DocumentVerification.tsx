import React from 'react';
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert 
} from 'lucide-react';
import type { DocumentVerificationReportItem } from '../../types/reportsAnalytics';

interface Report3DocumentVerificationProps {
  items: DocumentVerificationReportItem[];
  onExportCsv: () => void;
  onOpenPrintPreview: () => void;
}

export const Report3DocumentVerification: React.FC<Report3DocumentVerificationProps> = ({
  items,
  onExportCsv,
  onOpenPrintPreview,
}) => {
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">VERIFIED AUTHENTIC</span>;
      case 'FLAGGED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">ANOMALY FLAGGED</span>;
      case 'INCONCLUSIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">INCONCLUSIVE</span>;
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
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
              Statutory Report 03
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Document Verification Outcomes & Multi-Source Audit
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cryptographic SHA-256 hashes, QR validation outcomes, digital certificate chain evaluations, and anomaly classifications.
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
              <th className="py-3 px-4">Document Vault ID & App</th>
              <th className="py-3 px-4">Document Type & Hash</th>
              <th className="py-3 px-4">QR Code Outcome</th>
              <th className="py-3 px-4">Digital Signature (DSC)</th>
              <th className="py-3 px-4">Issuing Authority Check</th>
              <th className="py-3 px-4">Anomaly Classification</th>
              <th className="py-3 px-4 text-right">Authenticity Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((item) => (
              <tr key={item.documentId} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-[#102B4E]">{item.documentId}</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5">{item.applicationId}</div>
                  <div className="text-[10px] text-slate-400">{item.institutionName}</div>
                </td>

                <td className="py-3.5 px-4 max-w-[200px]">
                  <div className="font-semibold text-slate-800 text-[11px]">{item.documentType}</div>
                  <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5" title={item.fileHash}>
                    SHA-256: {item.fileHash.substring(0, 18)}...
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {item.qrVerificationResult === 'VERIFIED_VALID' ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid QR
                    </span>
                  ) : item.qrVerificationResult === 'FAILED' ? (
                    <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Mismatch
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">N/A (No QR)</span>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {item.digitalSignatureResult === 'VALID_DSC' ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Class 3 Valid
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5" /> Invalid / Unsigned
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {item.authorityCrossCheckResult === 'MATCH_CONFIRMED' ? (
                    <span className="text-emerald-700 font-bold text-[11px]">Match Confirmed</span>
                  ) : item.authorityCrossCheckResult === 'UNREGISTERED_RECORD' ? (
                    <span className="text-rose-700 font-bold text-[11px]">Unregistered</span>
                  ) : (
                    <span className="text-amber-700 font-bold text-[11px]">Timeout</span>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {item.anomalyClassification.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {getVerdictBadge(item.authenticityVerdict)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
