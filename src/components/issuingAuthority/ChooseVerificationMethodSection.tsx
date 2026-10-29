import React from 'react';
import { 
  QrCode, 
  Hash, 
  Globe2, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { VerificationMethodType } from '../../types/issuingAuthority';

interface ChooseVerificationMethodSectionProps {
  activeMethod: VerificationMethodType;
  onSelectMethod: (method: VerificationMethodType) => void;
  pendingManualReviewCount: number;
}

export const ChooseVerificationMethodSection: React.FC<ChooseVerificationMethodSectionProps> = ({
  activeMethod,
  onSelectMethod,
  pendingManualReviewCount,
}) => {
  const methods = [
    {
      id: 'QR_CODE' as VerificationMethodType,
      title: 'QR Code Verification',
      badge: 'Method 1 • Optical & URL',
      description: 'Extract certificate references from supported QR codes and verify them against trusted issuing domains.',
      icon: QrCode,
      colorBg: 'bg-blue-50',
      colorText: 'text-[#2563EB]',
      actionText: 'Open QR Scanner',
    },
    {
      id: 'REFERENCE_NUMBER' as VerificationMethodType,
      title: 'Reference Number Verification',
      badge: 'Method 2 • Registry Lookup',
      description: 'Verify certificate details using a unique certificate or gazette reference number across authority databases.',
      icon: Hash,
      colorBg: 'bg-emerald-50',
      colorText: 'text-emerald-600',
      actionText: 'Lookup Reference',
    },
    {
      id: 'OFFICIAL_API' as VerificationMethodType,
      title: 'Official API / Portal Verification',
      badge: 'Method 3 • Authorized Gateway',
      description: 'Connect directly to authorized state registries, AICTE APH portals, and digital repositories via official APIs.',
      icon: Globe2,
      colorBg: 'bg-indigo-50',
      colorText: 'text-indigo-600',
      actionText: 'Connect Official Source',
    },
    {
      id: 'MANUAL_OFFICER' as VerificationMethodType,
      title: 'Manual Officer Verification',
      badge: 'Method 4 • Human Scrutiny',
      description: 'Allow authorized officers to examine physical seals, signatures, and evidence when automated verification is inconclusive.',
      icon: UserCheck,
      colorBg: 'bg-purple-50',
      colorText: 'text-purple-600',
      actionText: 'Open Review Queue',
      badgeExtra: pendingManualReviewCount > 0 ? `${pendingManualReviewCount} in Queue` : undefined,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
            Verification Channels
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#102B4E] mt-0.5">
            Choose Verification Method
          </h2>
          <p className="text-xs text-slate-500">
            Select an automated or human scrutiny channel. All four verification methods are first-class, fully operational workflows.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Compliance Architecture</span>
        </div>
      </div>

      {/* 4 Responsive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {methods.map((method) => {
          const Icon = method.icon;
          const isActive = activeMethod === method.id;

          return (
            <div
              key={method.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-[#2563EB] bg-gradient-to-b from-[#F4F8FF] to-white shadow-md ring-1 ring-[#2563EB]/40' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl ${method.colorBg} ${method.colorText} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {method.badgeExtra ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                      {method.badgeExtra}
                    </span>
                  ) : isActive ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : null}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {method.badge}
                  </span>
                  <h3 className="text-sm font-bold text-[#102B4E] mt-0.5">
                    {method.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectMethod(method.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8]'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]'
                  }`}
                >
                  <span>{method.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
