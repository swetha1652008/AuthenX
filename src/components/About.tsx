import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { InstitutionIllustration } from './illustrations/InstitutionIllustration';

interface AboutProps {
  onScrollTo?: (sectionId: string) => void;
}

export const About: React.FC<AboutProps> = ({ onScrollTo }) => {
  const handleScroll = (id: string) => {
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Educational Institution Building Illustration */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <InstitutionIllustration />
          </div>

          {/* Right Column: Heading, Description, Bullets, and "Know More" Button */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-royal-700 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-royal-600" />
              <span>Institutional Regulatory Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              About <span className="text-royal-600">AuthenX</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              AuthenX is an AI-powered decision-support platform designed to assist in the preliminary
              validation of technical institution applications for Extension of Approval (EoA) and
              other approval-related changes. It combines document processing, anomaly detection, and
              authorized source verification to identify missing information, expired documents,
              inconsistencies, and potential compliance gaps.
            </p>

            {/* Key Capabilities Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Anomaly Detection</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Flags tampered metadata, expired stamps, and duplicates.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">EoA Application Scrutiny</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Streamlines technical approvals against AICTE norms.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Authorized Cross-Checks</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Verifies via DigiLocker, state portals & QR codes.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Objective Decision Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Equips scrutiny committees with instant audit trails.</p>
                </div>
              </div>
            </div>

            {/* "Know More" Button that scrolls to Key Features */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleScroll('features')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-navy-800 hover:bg-royal-600 active:scale-[0.98] transition-all shadow-md group cursor-pointer"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4 text-teal-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
