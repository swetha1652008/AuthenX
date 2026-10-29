import React from 'react';
import { Zap, Layers, Scale, CheckCircle2 } from 'lucide-react';

export const KeyBenefits: React.FC = () => {
  const benefits = [
    {
      title: 'Faster Verification',
      metric: '80% Faster Screening',
      description:
        'Automated OCR extraction and AI cross-checking transform weeks of manual document sifting into minutes of instant preliminary validation.',
      icon: Zap,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 border-amber-200',
      highlights: ['Instant document indexing', 'Automated anomaly detection'],
    },
    {
      title: 'Reduced Manual Work',
      metric: '65% Less Admin Burden',
      description:
        'Scrutiny committee officers focus their expertise on high-level decisions rather than verifying date stamps, seal alignments, and checklist counts.',
      icon: Layers,
      iconColor: 'text-royal-600',
      iconBg: 'bg-royal-50 border-royal-200',
      highlights: ['Pre-sorted deficiency lists', 'Automated cross-referencing'],
    },
    {
      title: 'Improved Consistency and Transparency',
      metric: '100% Uniform Rules',
      description:
        'Rules and deficiency checks are applied uniformly across all technical institutions with clear, exportable audit trails and transparent reasoning.',
      icon: Scale,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border-teal-200',
      highlights: ['Deterministic audit trail', 'Standardized scoring matrix'],
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 text-royal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Value Proposition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Benefits
          </h2>
          <p className="mt-3 text-base text-slate-600">
            How AuthenX elevates efficiency, accuracy, and institutional trust in regulatory verification.
          </p>
        </div>

        {/* 3 Horizontal Benefit Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover border border-slate-200/90 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-royal-300"
              >
                <div>
                  {/* Top Bar with Icon & Stat */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center border ${benefit.iconBg} ${benefit.iconColor} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-royal-700 bg-royal-50 border border-royal-100 px-2.5 py-1 rounded-full">
                      {benefit.metric}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-royal-600 transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom bullet points */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {benefit.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
