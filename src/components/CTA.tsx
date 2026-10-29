import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface CTAProps {
  onScrollTo?: (sectionId: string) => void;
}

export const CTA: React.FC<CTAProps> = ({ onScrollTo }) => {
  const navigate = useNavigate();
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
    <section id="cta" className="relative py-20 md:py-28 cta-gradient text-white overflow-hidden">
      {/* Decorative SVG Patterns & Watermarks */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ctaPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#FFFFFF" />
              <path d="M0 20H40M20 0V40" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaPattern)" />
        </svg>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-royal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Transforming Regulatory Compliance</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Ready to Get Started?
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Join AuthenX in exploring a smarter way to validate applications, authenticate documents, and support regulatory compliance.
        </p>

        {/* Action Buttons: Get Started & Explore Features */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl group cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-royal-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('features')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all border border-white/20 backdrop-blur-sm cursor-pointer"
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>Explore Features</span>
          </button>
        </div>

        {/* Trust Note */}
        <div className="pt-6 text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Preliminary decision-support prototype • Designed for AICTE compliance automation</span>
        </div>
      </div>
    </section>
  );
};
