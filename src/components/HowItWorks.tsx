import React from 'react';
import { UploadCloud, Cpu, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Application Upload',
      description: 'Institution submits application details and supporting documents.',
      icon: UploadCloud,
      color: 'blue',
      badgeBg: 'bg-blue-600 text-white',
      cardBg: 'bg-white',
    },
    {
      step: '02',
      title: 'AI Validation',
      description: 'Documents are processed and key information is extracted.',
      icon: Cpu,
      color: 'teal',
      badgeBg: 'bg-teal-600 text-white',
      cardBg: 'bg-white',
    },
    {
      step: '03',
      title: 'Verification',
      description:
        'Information is checked against available authorized sources and configured regulatory rules.',
      icon: ShieldCheck,
      color: 'royal',
      badgeBg: 'bg-royal-600 text-white',
      cardBg: 'bg-white',
    },
    {
      step: '04',
      title: 'Officer Review',
      description:
        'Reviewers examine the findings. Final statutory decisions remain with the competent authorities.',
      icon: UserCheck,
      color: 'navy',
      badgeBg: 'bg-navy-800 text-white',
      cardBg: 'bg-white',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Workflow Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A simple four-step process for faster and smarter validation.
          </p>
        </div>

        {/* 4 Connected Steps Grid */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-200 via-teal-200 to-slate-200 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Step Number & Icon Card */}
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-card border border-slate-200/90 flex items-center justify-center relative mb-6 group hover:border-royal-400 hover:shadow-card-hover transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-royal-50 group-hover:text-royal-600 transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Step Number Tag */}
                    <span
                      className={`absolute -top-3 -right-3 w-7 h-7 rounded-full ${item.badgeBg} text-xs font-extrabold flex items-center justify-center shadow-sm`}
                    >
                      {item.step}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50/60 hover:bg-white rounded-xl p-5 border border-slate-200/70 hover:border-slate-300 hover:shadow-subtle transition-all duration-200 w-full flex-1 flex flex-col justify-start">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Mobile/Tablet Arrow Indicator */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden my-3 text-slate-300">
                      <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Regulatory Governance Note */}
        <div className="mt-14 max-w-2xl mx-auto p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-center gap-2 text-center text-xs text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-royal-600 flex-shrink-0" />
          <span>Preliminary decision-support only; final statutory authority remains with the AICTE Council & Scrutiny Committees.</span>
        </div>
      </div>
    </section>
  );
};
