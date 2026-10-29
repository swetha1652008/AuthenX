import React, { useState } from 'react';
import { 
  Globe2, 
  Send, 
  UserCheck, 
  AlertCircle, 
  WifiOff, 
  ChevronDown,
  Info
} from 'lucide-react';
import { OFFICIAL_SOURCE_PROVIDERS, issuingAuthorityService } from '../../services/issuingAuthorityService';
import type { OfficialSourceDetails } from '../../types/issuingAuthority';
import type { InstitutionApplication } from '../../types/institution';

interface OfficialApiPortalWorkspaceProps {
  application: InstitutionApplication;
  onSendForManualReview: (reason: string, details?: string) => void;
  onVerificationComplete?: (result: OfficialSourceDetails) => void;
}

export const OfficialApiPortalWorkspace: React.FC<OfficialApiPortalWorkspaceProps> = ({
  application,
  onSendForManualReview,
  onVerificationComplete,
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState(OFFICIAL_SOURCE_PROVIDERS[0].id);
  const [certNumber, setCertNumber] = useState('KA-BLR-REG/2018/LND-49201');
  const [institutionId, setInstitutionId] = useState(application.institution.aictePermanentId);
  const [isQuerying, setIsQuerying] = useState(false);
  const [apiResult, setApiResult] = useState<OfficialSourceDetails | null>(null);

  const selectedProvider = OFFICIAL_SOURCE_PROVIDERS.find((p) => p.id === selectedProviderId) || OFFICIAL_SOURCE_PROVIDERS[0];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuerying(true);
    setApiResult(null);

    try {
      const res = await issuingAuthorityService.verifyOfficialApi(
        selectedProviderId,
        certNumber,
        institutionId
      );
      setApiResult(res);
      if (onVerificationComplete) {
        onVerificationComplete(res);
      }
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-5">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
            Method 3 Workspace
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#102B4E] mt-0.5 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-indigo-600" />
            Official API & Statutory Portal Verification Gateway
          </h3>
          <p className="text-xs text-slate-500">
            Query state and national government verification endpoints directly using authorized integration credentials.
          </p>
        </div>

        {/* Source Connection Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400">Gateway Status:</span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
            <WifiOff className="w-3 h-3 text-slate-400" />
            <span>Not Configured (Live Keys Pending)</span>
          </span>
        </div>
      </div>

      {/* Configuration & Query Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Provider Selector */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-700 block">
              Configured Official Source / Authority Provider
            </label>
            <div className="relative">
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white cursor-pointer"
              >
                {OFFICIAL_SOURCE_PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} ({provider.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Authority: {selectedProvider.authority}
            </p>
          </div>

          {/* Certificate Number Input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Certificate / Reference Number
            </label>
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          {/* Institution Identifier */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              AICTE Institution Identifier (PID)
            </label>
            <input
              type="text"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>
        </div>

        {/* Selected Provider Specification Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Endpoint Spec</span>
            <span className="font-semibold text-slate-800">{selectedProvider.endpointDescription}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Documentation Reference</span>
            <a href={selectedProvider.documentationRef} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-mono">
              {selectedProvider.documentationRef.replace('https://', '')}
            </a>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Adapter Type</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {selectedProvider.type}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onSendForManualReview('Official API unavailable', `Provider: ${selectedProvider.name} | Cert: ${certNumber}`)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span>Send for Manual Verification</span>
          </button>

          <button
            type="submit"
            disabled={isQuerying}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md cursor-pointer disabled:opacity-60"
          >
            {isQuerying ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isQuerying ? 'Querying Authorized Gateway...' : 'Verify with Official Source'}</span>
          </button>
        </div>
      </form>

      {/* Query Result / Unconfigured Banner */}
      {apiResult && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Official Integration Not Configured
                  </h4>
                  <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    GATEWAY OFFLINE
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Connect an authorized issuing-authority source to enable live verification.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSendForManualReview('Official API unavailable', `Provider ${selectedProvider.name} is not configured.`)}
              className="px-3.5 py-2 rounded-xl bg-[#102B4E] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Route Case to Manual Review</span>
            </button>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 break-all">
            {apiResult.rawPayloadSummary}
          </div>
        </div>
      )}

      {/* Notice */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Compliance & Security Rule: </strong>
          AuthenX enforces strict zero-fabrication standards: when external authority APIs lack registered credentials or network access, 
          the system displays <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">Official Integration Not Configured</code> and safely transitions cases to the manual verification queue.
        </div>
      </div>
    </div>
  );
};
