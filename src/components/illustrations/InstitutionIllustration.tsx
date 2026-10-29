import React from 'react';
import { ShieldCheck, Building2, FileCheck2, Sparkles } from 'lucide-react';

export const InstitutionIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto py-4">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-royal-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Composition Card */}
      <div className="relative z-10 bg-gradient-to-b from-white to-slate-50/80 rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200/90">
        {/* Top Header of the Illustration: Campus Inspection Banner */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-royal-50 flex items-center justify-center text-royal-600 border border-royal-100">
              <Building2 className="w-5 h-5 text-royal-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Technical Institute Campus</p>
              <p className="text-[10px] text-slate-500">Autonomous & Affiliated College</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-teal-600" />
            EoA 2026-27
          </span>
        </div>

        {/* Vector SVG of Technical Institution Building + Documents + Shield */}
        <div className="relative w-full h-56 flex items-center justify-center">
          <svg
            viewBox="0 0 360 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F2744" />
              </linearGradient>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
              <linearGradient id="shieldGradInst" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
            </defs>

            {/* Campus Ground / Base Steps */}
            <rect x="20" y="195" width="320" height="12" rx="4" fill="#CBD5E1" />
            <rect x="35" y="185" width="290" height="10" rx="3" fill="#E2E8F0" />
            <rect x="50" y="175" width="260" height="10" rx="2" fill="#F1F5F9" />

            {/* Main Institution Building Block */}
            <rect x="65" y="80" width="230" height="95" rx="4" fill="url(#wallGrad)" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Portico / Columns */}
            <rect x="90" y="100" width="14" height="75" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            <rect x="135" y="100" width="14" height="75" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            <rect x="210" y="100" width="14" height="75" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            <rect x="255" y="100" width="14" height="75" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />

            {/* Building Pediment (Triangular Gable Roof) */}
            <polygon points="180,35 60,80 300,80" fill="url(#roofGrad)" />
            <polygon points="180,48 85,80 275,80" fill="#FFFFFF" fillOpacity="0.12" />

            {/* Center Arch Doorway */}
            <path d="M162 175V125C162 115 198 115 198 125V175H162Z" fill="#0F2744" />
            <circle cx="180" cy="65" r="7" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="1.5" />

            {/* Windows in Lateral Wings */}
            <rect x="75" y="90" width="14" height="18" rx="2" fill="#93C5FD" opacity="0.7" />
            <rect x="75" y="120" width="14" height="20" rx="2" fill="#93C5FD" opacity="0.7" />
            <rect x="270" y="90" width="14" height="18" rx="2" fill="#93C5FD" opacity="0.7" />
            <rect x="270" y="120" width="14" height="20" rx="2" fill="#93C5FD" opacity="0.7" />

            {/* Floating Validated Documents on the Left */}
            <g transform="translate(18, 45) rotate(-6)">
              <rect width="70" height="90" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.5" filter="drop-shadow(0 8px 12px rgba(15,39,68,0.15))" />
              <rect x="8" y="12" width="40" height="4" rx="2" fill="#3B82F6" />
              <rect x="8" y="22" width="54" height="3" rx="1.5" fill="#94A3B8" />
              <rect x="8" y="30" width="54" height="3" rx="1.5" fill="#CBD5E1" />
              <rect x="8" y="38" width="36" height="3" rx="1.5" fill="#CBD5E1" />
              <circle cx="50" cy="65" r="10" fill="#10B981" fillOpacity="0.2" />
              <path d="M46 65L49 68L55 62" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Floating Compliance Shield on the Right */}
            <g transform="translate(245, 30)">
              <path
                d="M40 5L15 14V30C15 45 25 58 40 62C55 58 65 45 65 30V14L40 5Z"
                fill="url(#shieldGradInst)"
                filter="drop-shadow(0 10px 16px rgba(13,148,136,0.25))"
              />
              <path
                d="M32 32L38 38L49 26"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* Feature Badges below the illustration */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <FileCheck2 className="w-4 h-4 text-royal-600 flex-shrink-0" />
            <span className="font-semibold text-slate-700 text-[11px]">EoA Application</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-teal-50/60 border border-teal-100">
            <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="font-semibold text-teal-800 text-[11px]">Norms Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
