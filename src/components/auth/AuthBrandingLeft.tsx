import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Workflow, 
  ArrowLeft, 
  Sparkles 
} from 'lucide-react';
import { AuthenXLogo } from '../common/AuthenXLogo';

interface AuthBrandingLeftProps {
  onBackToHome?: () => void;
}

export const AuthBrandingLeft: React.FC<AuthBrandingLeftProps> = ({ onBackToHome }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#F4F8FF] via-[#EAF2FF] to-[#FFFFFF] p-8 lg:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#CFE2FE]">
      {/* Decorative Subtle Background Graphics (Light blue & Cyan accents) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#DDF7FA]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#E0EDFF]/80 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Subtle Circuit & Network Grid SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="networkGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1.5" fill="#1763CC" fillOpacity="0.15" />
            <path
              d="M24 0V48M0 24H48"
              stroke="#1763CC"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#networkGrid)" />
      </svg>

      {/* Top Header: Back to Home link & Logo */}
      <div className="relative z-10 space-y-6">
        <div>
          {onBackToHome ? (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1763CC] hover:text-[#0B1B3A] transition-colors py-1.5 px-3 rounded-lg bg-white/80 border border-[#CFE2FE] shadow-sm hover:shadow cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          ) : (
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1763CC] hover:text-[#0B1B3A] transition-colors py-1.5 px-3 rounded-lg bg-white/80 border border-[#CFE2FE] shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </a>
          )}
        </div>

        {/* 1. AuthenX Logo with Shield-Check */}
        <div className="pt-2">
          <AuthenXLogo size="lg" showTagline={false} />
        </div>

        {/* 2. Tagline & 3. Description */}
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF7FA] border border-[#B2EBF2] text-[#0A588C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#1763CC]" />
            <span>National Verification Infrastructure</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
            Trust Every Document. <br />
            <span className="text-[#1763CC]">Verify Every Detail.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-md">
            AI-powered application validation, document authentication and regulatory compliance support.
          </p>
        </div>

        {/* 4. Three Feature Highlights */}
        <div className="pt-4 space-y-3.5 max-w-md">
          {/* Feature 1: Secure Document Verification */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/90 border border-[#E2E8F0] shadow-sm hover:border-[#1763CC]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] border border-[#CFE2FE] flex items-center justify-center text-[#1763CC] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1763CC]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1B3A]">Secure Document Verification</h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                Multi-layer OCR extraction and cryptographic integrity verification.
              </p>
            </div>
          </div>

          {/* Feature 2: Intelligent Compliance Checks */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/90 border border-[#E2E8F0] shadow-sm hover:border-[#1763CC]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#DDF7FA] border border-[#B2EBF2] flex items-center justify-center text-[#0A588C] flex-shrink-0">
              <FileCheck2 className="w-5 h-5 text-[#0A588C]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1B3A]">Intelligent Compliance Checks</h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                Autonomous rule validation against AICTE Approval Process Handbook norms.
              </p>
            </div>
          </div>

          {/* Feature 3: Transparent Review Workflow */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/90 border border-[#E2E8F0] shadow-sm hover:border-[#1763CC]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] border border-[#CFE2FE] flex items-center justify-center text-[#1763CC] flex-shrink-0">
              <Workflow className="w-5 h-5 text-[#1763CC]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1B3A]">Transparent Review Workflow</h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                Audit-trailed deficiency tracking for scrutiny committees and institutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subtle Abstract Graphics (Shields, Documents, Networks) */}
      <div className="relative z-10 pt-8 mt-6 border-t border-[#CFE2FE]/80">
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold text-[#0B1B3A]">AICTE APH 2026-27 Compliant</span>
          </div>
          <span className="font-mono text-[11px] text-[#1763CC] bg-white px-2 py-0.5 rounded border border-[#CFE2FE]">
            v2.4 Sandbox
          </span>
        </div>
      </div>
    </div>
  );
};
