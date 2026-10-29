import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { HeroIllustration } from './illustrations/HeroIllustration';

interface HeroProps {
  onScrollTo?: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollTo }) => {
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
    <section
      id="home"
      className="relative overflow-hidden hero-gradient pt-8 pb-16 md:pt-14 md:pb-24 border-b border-blue-100/60"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-10 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="heroGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V0h32" fill="none" stroke="#0F2744" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Badge, Description, CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small Badge: AI-Powered Validation Platform */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-subtle border border-blue-200/80 text-royal-700 text-xs font-semibold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-royal-600" />
              <span>AI-Powered Validation Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Smarter Application Validation{' '}
              <span className="bg-gradient-to-r from-royal-600 via-royal-700 to-teal-600 bg-clip-text text-transparent block sm:inline">
                for a Compliant Tomorrow
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              AuthenX uses AI to validate applications, authenticate documents, and support regulatory
              compliance for technical institutions. Experience faster, smarter, and more transparent
              validation.
            </p>

            {/* Buttons: Get Started & Learn More */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-royal-600 hover:bg-royal-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-teal-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll('about')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 hover:text-royal-600 active:scale-[0.98] transition-all border border-slate-200/90 shadow-sm cursor-pointer"
              >
                <span>Learn More</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 border-t border-blue-100/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-royal-600" />
                <span>AICTE Approval Handbook Norms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Preliminary Decision Support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Autonomous Cross-Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Document Verification Illustration */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};
