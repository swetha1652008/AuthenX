import React, { useState } from 'react';
import { 
  Columns, 
  ArrowLeftRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Hash, 
  HelpCircle,
  FileCheck2,
  Layers
} from 'lucide-react';
import type { ManagedDocument } from '../../types/document';
import type { SideBySideComparisonResult, FieldComparisonStatus } from '../../types/anomaly';
import { anomalyService } from '../../services/anomalyService';

interface SideBySideComparisonWorkspaceProps {
  documents: ManagedDocument[];
  initialDocAId?: string;
  initialDocBId?: string;
}

export const SideBySideComparisonWorkspace: React.FC<SideBySideComparisonWorkspaceProps> = ({
  documents,
  initialDocAId,
  initialDocBId,
}) => {
  const [selectedDocAId, setSelectedDocAId] = useState<string>(
    initialDocAId || (documents[0]?.id ?? '')
  );
  const [selectedDocBId, setSelectedDocBId] = useState<string>(
    initialDocBId || (documents[1]?.id ?? documents[0]?.id ?? '')
  );

  const [prevInitialA, setPrevInitialA] = useState(initialDocAId);
  const [prevInitialB, setPrevInitialB] = useState(initialDocBId);

  // Sync when initial IDs change from outside (state adjustment during render)
  if (initialDocAId !== prevInitialA) {
    setPrevInitialA(initialDocAId);
    if (initialDocAId) setSelectedDocAId(initialDocAId);
  }
  if (initialDocBId !== prevInitialB) {
    setPrevInitialB(initialDocBId);
    if (initialDocBId) setSelectedDocBId(initialDocBId);
  }

  const docA = documents.find((d) => d.id === selectedDocAId);
  const docB = documents.find((d) => d.id === selectedDocBId);

  const comparisonResult: SideBySideComparisonResult | null = 
    docA && docB ? anomalyService.compareDocuments(docA, docB) : null;

  const handleSwap = () => {
    const temp = selectedDocAId;
    setSelectedDocAId(selectedDocBId);
    setSelectedDocBId(temp);
  };

  const getStatusBadge = (status: FieldComparisonStatus) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Match</span>
          </span>
        );
      case 'MISMATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Mismatch</span>
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span>Missing in Doc</span>
          </span>
        );
      case 'UNCERTAIN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <span>Uncertain</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
      {/* Workspace Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Columns className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#102B4E]">
                Side-by-Side Forensic Document Comparison
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                Interactive Workspace
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Directly cross-reference two institutional documents to identify token overlap, metadata discrepancies, and identical byte patterns
            </p>
          </div>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto shadow-2xs"
          title="Swap Document A and Document B positions"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
          <span>Swap Documents</span>
        </button>
      </div>

      {/* Document Selectors Row */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-slate-200 bg-slate-50/30">
        {/* Document A Selector */}
        <div>
          <label htmlFor="doc-a-selector" className="block text-xs font-bold text-slate-700 mb-1.5">
            <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white text-center leading-4 text-[10px] font-bold mr-1.5">
              A
            </span>
            Document A (Primary Source)
          </label>
          <select
            id="doc-a-selector"
            value={selectedDocAId}
            onChange={(e) => setSelectedDocAId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {documents.map((doc) => (
              <option key={`a-${doc.id}`} value={doc.id}>
                {doc.originalFilename} ({doc.documentCategory})
              </option>
            ))}
          </select>
        </div>

        {/* Document B Selector */}
        <div>
          <label htmlFor="doc-b-selector" className="block text-xs font-bold text-slate-700 mb-1.5">
            <span className="inline-block w-4 h-4 rounded-full bg-teal-600 text-white text-center leading-4 text-[10px] font-bold mr-1.5">
              B
            </span>
            Document B (Comparison Target)
          </label>
          <select
            id="doc-b-selector"
            value={selectedDocBId}
            onChange={(e) => setSelectedDocBId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {documents.map((doc) => (
              <option key={`b-${doc.id}`} value={doc.id}>
                {doc.originalFilename} ({doc.documentCategory})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Analysis Summary Banner */}
      {comparisonResult && (
        <div className="p-5 border-b border-slate-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Token Similarity */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Token Content Similarity
                </span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  comparisonResult.textSimilarityScore >= 80 
                    ? 'bg-red-100 text-red-800' 
                    : comparisonResult.textSimilarityScore >= 50
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {comparisonResult.textSimilarityScore}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    comparisonResult.textSimilarityScore >= 80 
                      ? 'bg-red-500' 
                      : comparisonResult.textSimilarityScore >= 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${comparisonResult.textSimilarityScore}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                {comparisonResult.textSimilarityScore >= 80 
                  ? 'High textual overlap. Candidate duplicate or cross-application reuse.'
                  : comparisonResult.textSimilarityScore >= 50
                  ? 'Moderate similarity. Likely related statutory forms or shared boilerplate.'
                  : 'Low text similarity. Documents exhibit distinct textual signatures.'}
              </p>
            </div>

            {/* 2. SHA-256 Hash Collision Analysis */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-600" />
                  SHA-256 Hash Match
                </span>
                {comparisonResult.isExactByteDuplicate ? (
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    Exact Match (100%)
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Distinct Payloads
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-tight mt-3">
                {comparisonResult.isExactByteDuplicate
                  ? 'Both documents share the identical cryptographic digest. Byte-for-byte exact duplication detected.'
                  : 'Hashes differ. Files have distinct underlying binary payloads.'}
              </p>
            </div>

            {/* 3. Overall Field Evaluation */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                Metadata Alignment Summary
              </span>
              <div className="flex items-center gap-3 text-xs mt-3">
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {comparisonResult.fieldComparisons.filter((f) => f.status === 'MATCH').length} Matches
                  </span>
                </div>
                <div className="flex items-center gap-1 text-red-700 font-bold">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>
                    {comparisonResult.fieldComparisons.filter((f) => f.status === 'MISMATCH').length} Mismatches
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <span>
                    {comparisonResult.fieldComparisons.filter((f) => f.status === 'MISSING').length} Unspecified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Cards Preview */}
      {docA && docB && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-slate-200">
          {/* Doc A Metadata Card */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <span className="font-bold text-xs text-[#102B4E] truncate max-w-[220px]" title={docA.originalFilename}>
                  {docA.originalFilename}
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {docA.documentCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2">
              <div>
                <span className="text-slate-400 block text-[10px]">File Size:</span>
                <span className="font-semibold">{docA.fileSize}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status:</span>
                <span className="font-semibold">{docA.uploadStatus}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">SHA-256 Hash:</span>
                <span className="font-mono text-[10px] text-slate-700 truncate block" title={docA.sha256Hash}>
                  {docA.sha256Hash}
                </span>
              </div>
            </div>
          </div>

          {/* Doc B Metadata Card */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                  B
                </span>
                <span className="font-bold text-xs text-[#102B4E] truncate max-w-[220px]" title={docB.originalFilename}>
                  {docB.originalFilename}
                </span>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                {docB.documentCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2">
              <div>
                <span className="text-slate-400 block text-[10px]">File Size:</span>
                <span className="font-semibold">{docB.fileSize}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status:</span>
                <span className="font-semibold">{docB.uploadStatus}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">SHA-256 Hash:</span>
                <span className="font-mono text-[10px] text-slate-700 truncate block" title={docB.sha256Hash}>
                  {docB.sha256Hash}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field-by-Field Matrix Table */}
      {comparisonResult && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 w-[25%]">Field / Statutory Attribute</th>
                <th className="py-3 px-4 w-[30%]">Document A Value</th>
                <th className="py-3 px-4 w-[30%]">Document B Value</th>
                <th className="py-3 px-4 w-[15%] text-right">Alignment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {comparisonResult.fieldComparisons.map((field) => {
                const isMismatch = field.status === 'MISMATCH';

                return (
                  <tr
                    key={field.fieldKey}
                    className={`transition-colors ${
                      isMismatch ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Field Name */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        {isMismatch && <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                        <span>{field.fieldName}</span>
                      </div>
                    </td>

                    {/* Doc A Value */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      {field.docAValue || (
                        <span className="text-slate-400 italic font-sans text-xs">Not extracted</span>
                      )}
                    </td>

                    {/* Doc B Value */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      {field.docBValue || (
                        <span className="text-slate-400 italic font-sans text-xs">Not extracted</span>
                      )}
                    </td>

                    {/* Status Badge & Details */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(field.status)}
                        {field.details && (
                          <span className="text-[10px] text-slate-400 font-sans max-w-[140px] truncate" title={field.details}>
                            {field.details}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
