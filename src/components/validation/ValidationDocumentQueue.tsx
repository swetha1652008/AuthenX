import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Upload, 
  RefreshCw, 
  X,
  Filter
} from 'lucide-react';
import type { ManagedDocument } from '../../types/document';

interface ValidationDocumentQueueProps {
  documents: ManagedDocument[];
  selectedDocId: string;
  onSelectDoc: (docId: string) => void;
  onNavigateToPage4: () => void;
  onRetryProcessing: (docId: string) => void;
}

export const ValidationDocumentQueue: React.FC<ValidationDocumentQueueProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onNavigateToPage4,
  onRetryProcessing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.originalFilename.toLowerCase().includes(q);
        const matchCat = doc.documentCategory.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      if (statusFilter === 'FINDINGS') {
        if (!doc.anomalies || doc.anomalies.length === 0) return false;
      }
      if (statusFilter === 'EXPIRED') {
        if (!doc.isExpired) return false;
      }
      if (statusFilter === 'VERIFIED') {
        if (doc.verificationStatus !== 'Verified by Authorized Source') return false;
      }
      return true;
    });
  }, [documents, searchQuery, statusFilter]);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#CFE2FE] shadow-card flex flex-col h-full space-y-4">
      {/* Queue Header & Upload Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-[#102B4E]">
            Document Queue
          </h3>
          <p className="text-[11px] text-slate-500">
            {filteredDocs.length} of {documents.length} files available
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToPage4}
          className="px-2.5 py-1.5 rounded-xl bg-[#EAF2FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#CFE2FE] text-[11px] font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          title="Upload or Replace documents in Statutory Vault"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Documents</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter document list..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 text-slate-800"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
        <span className="font-bold text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
        </span>
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#102B4E] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('FINDINGS')}
          className={`px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
            statusFilter === 'FINDINGS'
              ? 'bg-amber-500 text-white'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Findings
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('EXPIRED')}
          className={`px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
            statusFilter === 'EXPIRED'
              ? 'bg-rose-500 text-white'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Expired
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('VERIFIED')}
          className={`px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
            statusFilter === 'VERIFIED'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Verified
        </button>
      </div>

      {/* Document Queue Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[350px]">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            const hasAnomalies = doc.anomalies && doc.anomalies.length > 0;

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EAF2FF]/70 shadow-sm ring-1 ring-[#2563EB]/40'
                    : 'border-slate-200 hover:border-[#CFE2FE] bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE] truncate max-w-[170px]">
                    {doc.documentCategory}
                  </span>
                  {doc.isExpired ? (
                    <span className="text-[9px] font-extrabold uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      Expired
                    </span>
                  ) : hasAnomalies ? (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Anomalies
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Compliant
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${
                      isSelected ? 'text-[#102B4E]' : 'text-slate-800'
                    }`}>
                      {doc.originalFilename}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {doc.fileSize} • Uploaded {doc.uploadDate}
                    </p>
                  </div>
                </div>

                {/* Subfooter with retry or hash */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  <span className="font-mono text-[9px]">
                    ID: {doc.id.slice(-8)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetryProcessing(doc.id);
                    }}
                    className="text-slate-400 hover:text-[#2563EB] flex items-center gap-1 cursor-pointer"
                    title="Re-run AI processing"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Re-scan</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No matching documents</p>
            <p className="text-[11px] text-slate-400">
              Upload documents from Statutory Documents Vault to populate this validation queue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
