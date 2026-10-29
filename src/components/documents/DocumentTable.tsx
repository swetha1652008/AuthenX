import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  Download, 
  RefreshCw, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  XCircle,
  X
} from 'lucide-react';
import type { ManagedDocument, IssuingAuthorityVerificationStatus } from '../../types/document';
import { ALL_DOCUMENT_CATEGORIES } from '../../types/document';

interface DocumentTableProps {
  documents: ManagedDocument[];
  onPreview: (doc: ManagedDocument, initialTab?: 'preview' | 'ocr' | 'values' | 'anomalies' | 'verification') => void;
  onDownload: (doc: ManagedDocument) => void;
  onReplace: (doc: ManagedDocument) => void;
  onDelete: (docId: string) => void;
  externalFilter?: string; // from summary cards ('ALL', 'UPLOADED', 'MISSING', 'EXPIRED', 'PENDING', 'ATTENTION')
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onPreview,
  onDownload,
  onReplace,
  onDelete,
  externalFilter = 'ALL',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'uploadDate' | 'name' | 'size'>('uploadDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [docToDelete, setDocToDelete] = useState<ManagedDocument | null>(null);

  // Filter and sort logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. External filter from summary cards
      if (externalFilter === 'EXPIRED' && !doc.isExpired) return false;
      if (
        externalFilter === 'PENDING' &&
        doc.verificationStatus !== 'Verification Pending' &&
        doc.verificationStatus !== 'External Verification Not Configured'
      ) {
        return false;
      }
      if (
        externalFilter === 'ATTENTION' &&
        !doc.isExpired &&
        (!doc.anomalies || doc.anomalies.length === 0)
      ) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = doc.originalFilename.toLowerCase().includes(query);
        const matchCat = doc.documentCategory.toLowerCase().includes(query);
        const matchId = doc.id.toLowerCase().includes(query);
        if (!matchName && !matchCat && !matchId) return false;
      }

      // 3. Category filter
      if (categoryFilter !== 'ALL' && doc.documentCategory !== categoryFilter) {
        return false;
      }

      // 4. Verification filter
      if (verificationFilter !== 'ALL' && doc.verificationStatus !== verificationFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'uploadDate') {
        const dateA = new Date(`${a.uploadDate} ${a.uploadTime || ''}`).getTime();
        const dateB = new Date(`${b.uploadDate} ${b.uploadTime || ''}`).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'name') {
        return sortAsc
          ? a.originalFilename.localeCompare(b.originalFilename)
          : b.originalFilename.localeCompare(a.originalFilename);
      }
      if (sortField === 'size') {
        return sortAsc ? a.fileSizeBytes - b.fileSizeBytes : b.fileSizeBytes - a.fileSizeBytes;
      }
      return 0;
    });
  }, [documents, externalFilter, searchQuery, categoryFilter, verificationFilter, sortField, sortAsc]);

  const toggleSort = (field: 'uploadDate' | 'name' | 'size') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const renderVerificationBadge = (status: IssuingAuthorityVerificationStatus) => {
    switch (status) {
      case 'Officially Verified':
      case 'Verified by Authorized Source':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Officially Verified</span>
          </span>
        );
      case 'Checks Passed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-300">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            <span>Checks Passed</span>
          </span>
        );
      case 'Authority Verification Pending':
      case 'External Verification Not Configured':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200" title="Internal checks passed. External authority live gateway connection pending.">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Authority Verification Pending</span>
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Warning</span>
          </span>
        );
      case 'Needs Manual Review':
      case 'Manual Review Required':
      case 'Mismatch Detected':
      case 'Expired':
      case 'Duplicate Detected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>Needs Manual Review</span>
          </span>
        );
      case 'Processing Failed':
      case 'Verification Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Processing Failed</span>
          </span>
        );
      case 'Signature Valid — Authenticity Not Independently Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200" title="Cryptographic signature verified, but authority record check not independently confirmed">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            <span>Signature Valid (Unconfirmed)</span>
          </span>
        );
      case 'Pending Verification':
      case 'Verification Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>Pending Verification</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Table Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-[#102B4E]">
            Managed Statutory Documents Archive
          </h3>
          <p className="text-xs text-slate-500">
            Showing {filteredDocuments.length} of {documents.length} recorded documents
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search filename or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {ALL_DOCUMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="Officially Verified">Officially Verified</option>
            <option value="Checks Passed">Checks Passed</option>
            <option value="Authority Verification Pending">Authority Verification Pending</option>
            <option value="Warning">Warning</option>
            <option value="Needs Manual Review">Needs Manual Review</option>
            <option value="Processing Failed">Processing Failed</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 uppercase font-bold text-slate-600 text-[10px] tracking-wider">
            <tr>
              <th
                onClick={() => toggleSort('name')}
                className="p-3.5 cursor-pointer hover:bg-slate-100 select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Document Details</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3.5">Category</th>
              <th
                onClick={() => toggleSort('size')}
                className="p-3.5 cursor-pointer hover:bg-slate-100 select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Type / Size</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('uploadDate')}
                className="p-3.5 cursor-pointer hover:bg-slate-100 select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Upload Timestamp</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3.5">Validity Expiry</th>
              <th className="p-3.5">OCR Status</th>
              <th className="p-3.5">Issuing Authority Check</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => {
                const hasAnomalies = doc.anomalies && doc.anomalies.length > 0;

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Document Details & Hash */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-slate-900 truncate block hover:text-[#2563EB] cursor-pointer" onClick={() => onPreview(doc)}>
                            {doc.originalFilename}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400">
                              {doc.id}
                            </span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span
                              className="font-mono text-[9px] text-slate-400 truncate max-w-[110px]"
                              title={`SHA-256: ${doc.sha256Hash}`}
                            >
                              SHA: {doc.sha256Hash.substring(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-[#2563EB] bg-[#EAF2FF] border border-[#CFE2FE]">
                        {doc.documentCategory}
                      </span>
                    </td>

                    {/* File Type & Size */}
                    <td className="p-3.5 font-semibold text-slate-700">
                      <div>
                        <span>{doc.mimeType.split('/')[1]?.toUpperCase() || 'PDF'}</span>
                        <span className="text-[10px] text-slate-400 block">{doc.fileSize}</span>
                      </div>
                    </td>

                    {/* Upload Timestamp */}
                    <td className="p-3.5 text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-800">{doc.uploadDate}</span>
                        <span className="text-[10px] text-slate-400 block">{doc.uploadTime}</span>
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="p-3.5">
                      {doc.expiryDate ? (
                        <div>
                          <span className={`font-semibold ${doc.isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                            {doc.expiryDate}
                          </span>
                          {doc.isExpired ? (
                            <span className="block text-[9px] font-extrabold text-rose-600 uppercase">
                              Expired
                            </span>
                          ) : (
                            <span className="block text-[9px] text-emerald-600 font-bold">
                              Valid
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No Expiry</span>
                      )}
                    </td>

                    {/* OCR Status */}
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                        <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                        {doc.ocrStatus}
                      </span>
                    </td>

                    {/* Issuing Authority Verification */}
                    <td className="p-3.5">
                      {renderVerificationBadge(doc.verificationStatus)}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Verification & Audit */}
                        <button
                          type="button"
                          onClick={() => onPreview(doc, 'verification')}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                          title="View Verification Details, Digital Signature & QR Audit"
                        >
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                        </button>

                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => onPreview(doc, 'preview')}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#2563EB] hover:bg-[#EAF2FF] transition-colors cursor-pointer"
                          title="Preview Document & OCR"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          onClick={() => onDownload(doc)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Replace */}
                        <button
                          type="button"
                          onClick={() => onReplace(doc)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Replace Document"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {hasAnomalies && (
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-amber-600 font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Anomaly Flagged</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-bold text-slate-700">No matching documents found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search criteria, category filters, or upload a new file above.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Confirm Document Deletion</h4>
                <p className="text-xs text-slate-500">This action will be logged in the audit trail.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700">
              Are you sure you want to remove <strong className="text-slate-900">{docToDelete.originalFilename}</strong> ({docToDelete.documentCategory})?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(docToDelete.id);
                  setDocToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
