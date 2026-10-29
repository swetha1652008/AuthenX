import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Cpu, 
  Search, 
  Database, 
  Lock, 
  Award
} from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto py-6">
      {/* Background Decorative Glow & Circuit Grids */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Illustration Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Floating Top Badge: AI Security Shield */}
        <div className="absolute -top-5 left-4 sm:left-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-card border border-blue-100 flex items-center gap-2.5 animate-float z-30">
          <div className="w-8 h-8 rounded-lg bg-royal-500/10 flex items-center justify-center text-royal-600">
            <ShieldCheck className="w-5 h-5 text-royal-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">Security Shield</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Tamper-Proof Validation</p>
          </div>
        </div>

        {/* Floating Right Badge: Authorized Source Verification */}
        <div className="absolute top-20 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-card border border-teal-100 flex items-center gap-2.5 z-30 animate-pulse-slow">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-800 block">Source Verified</span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-semibold inline-block mt-0.5">
              DigiLocker / Reg. APIs
            </span>
          </div>
        </div>

        {/* Floating Left Bottom Badge: Compliance Status */}
        <div className="absolute -bottom-4 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-card border border-emerald-100 flex items-center gap-2.5 z-30">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-800">Compliance Status</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-[10px] text-emerald-600 font-bold">100% AICTE Norms Met</p>
          </div>
        </div>

        {/* Laptop Mockup Rendering */}
        <div className="w-full max-w-[460px] sm:max-w-[490px] bg-slate-800 rounded-t-2xl p-2.5 shadow-elevated border-t border-x border-slate-700">
          {/* Laptop Web Camera & Bezel */}
          <div className="flex items-center justify-between pb-1.5 px-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700 mx-auto" />
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Cpu className="w-3 h-3 text-teal-400" />
              <span>AI-CORE v2.4</span>
            </div>
          </div>

          {/* Laptop Screen Content: Live Verification Results */}
          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 text-white p-3.5 sm:p-4 text-xs font-sans">
            {/* Screen Top Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-royal-600 flex items-center justify-center text-white">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-[11px] text-slate-200 leading-tight">
                    APP-2026-AICTE-8491
                  </p>
                  <p className="text-[9px] text-slate-400">Inst. Code: 1-938210941 • EoA Renewal</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>

            {/* Verification Analytics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-800/80 p-2.5 rounded-md border border-slate-700/60">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>OCR Accuracy</span>
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </div>
                <div className="text-sm font-bold text-slate-100">99.8%</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-royal-500 h-full w-[98%]" />
                </div>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-md border border-slate-700/60">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Authenticity Score</span>
                  <Lock className="w-3 h-3 text-royal-400" />
                </div>
                <div className="text-sm font-bold text-emerald-400">Valid • Clear</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full" />
                </div>
              </div>
            </div>

            {/* Scanned Documents Checklist */}
            <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-md border border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 pb-1 border-b border-slate-800">
                <span>Validated Document Item</span>
                <span>Audit Result</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  Land Title & Ownership Deed
                </span>
                <span className="text-emerald-400 font-semibold">Matched (State Reg)</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  Building Plan & Occupancy Cert
                </span>
                <span className="text-emerald-400 font-semibold">Approved (Municipal)</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  Fire Safety NOC (Valid till 2028)
                </span>
                <span className="text-emerald-400 font-semibold">Active & Verified</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  Faculty Cadre Ratio (1:15)
                </span>
                <span className="text-emerald-400 font-semibold">Compliant</span>
              </div>
            </div>

            {/* Real-time Status footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Search className="w-2.5 h-2.5 text-teal-400" />
                Cross-referenced with AICTE HandBook 2026-27
              </span>
              <span className="text-teal-400 font-mono">0.42s latency</span>
            </div>
          </div>
        </div>

        {/* Laptop Base Stand */}
        <div className="w-[520px] max-w-[108%] h-3.5 bg-slate-700 rounded-b-xl shadow-lg relative flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-500 rounded-full" />
        </div>
        <div className="w-[540px] max-w-[114%] h-1 bg-slate-400/40 rounded-full blur-[1px] mt-0.5" />
      </div>
    </div>
  );
};
