import React from 'react';
import { 
  FileCheck, 
  BrainCircuit, 
  QrCode, 
  CheckSquare, 
  Building, 
  LayoutDashboard 
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Document Verification',
      description:
        'Extract document information using OCR and check completeness, expiry dates, and authenticity indicators.',
      icon: FileCheck,
      color: 'blue',
      badgeClass: 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
      accentBorder: 'group-hover:border-blue-300',
    },
    {
      title: 'AI Validation',
      description:
        'Identify inconsistencies, duplicate documents, and potential anomaly indicators.',
      icon: BrainCircuit,
      color: 'purple',
      badgeClass: 'bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
      accentBorder: 'group-hover:border-purple-300',
    },
    {
      title: 'Source Verification',
      description:
        'Support verification through authorized portals, APIs, QR codes, and trusted sources where available.',
      icon: QrCode,
      color: 'green',
      badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      accentBorder: 'group-hover:border-emerald-300',
    },
    {
      title: 'Compliance Checking',
      description:
        'Compare application details against configurable regulatory requirements.',
      icon: CheckSquare,
      color: 'orange',
      badgeClass: 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
      accentBorder: 'group-hover:border-amber-300',
    },
    {
      title: 'Infrastructure Review',
      description:
        'Assist with reviewing photographs, floor plans, certificates, and infrastructure evidence.',
      icon: Building,
      color: 'teal',
      badgeClass: 'bg-teal-50 text-teal-600 border-teal-200 group-hover:bg-teal-600 group-hover:text-white',
      accentBorder: 'group-hover:border-teal-300',
    },
    {
      title: 'Validation Dashboard',
      description:
        'View application status, validation findings, and pending review tasks.',
      icon: LayoutDashboard,
      color: 'indigo',
      badgeClass: 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
      accentBorder: 'group-hover:border-indigo-300',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50/70 border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-royal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Enterprise Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Features
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Powerful AI-driven capabilities for accurate, secure, and compliant application processing.
          </p>
        </div>

        {/* 6 Responsive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover border border-slate-200/80 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle top indicator bar */}
                <div className="w-10 h-1 bg-slate-200 rounded-full group-hover:w-16 group-hover:bg-royal-500 transition-all duration-300 mb-5" />

                <div>
                  {/* Icon Badge */}
                  <div
                    className={`w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 mb-5 ${feature.badgeClass}`}
                  >
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-royal-600 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Footer Sub-indicator */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="font-mono text-[11px]">Feature 0{idx + 1}</span>
                  <span className="text-royal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Automated & Verified →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
