import React from 'react';
import { FileSearch, Landmark, MapPinCheck, CheckCircle2 } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      title: 'Document Checking',
      description: 'Validate submitted documents, certificates, and supporting records.',
      details: [
        'Automated OCR key-value extraction',
        'Digital signature & QR code authentication',
        'Validity dates & expiry verification',
      ],
      icon: FileSearch,
      iconColor: 'text-royal-600',
      iconBg: 'bg-royal-50 border-royal-200',
      badge: 'Core OCR Engine',
    },
    {
      title: 'Institution Details Validation',
      description: 'Check institution details and available institutional records.',
      details: [
        'Affiliation & trust deed verification',
        'Faculty cadre ratio & qualification checks',
        'Intake capacity vs. course approvals',
      ],
      icon: Landmark,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border-teal-200',
      badge: 'Institutional Registry',
    },
    {
      title: 'Infrastructure Compliance',
      description:
        'Assist in reviewing photographs, floor plans, and infrastructure-related evidence.',
      details: [
        'Geo-tagged & timestamped site photos',
        'Built-up area & instructional room calculations',
        'Barrier-free access & safety standard audits',
      ],
      icon: MapPinCheck,
      iconColor: 'text-navy-700',
      iconBg: 'bg-blue-50 border-blue-200',
      badge: 'Facility AI Audit',
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50/60 border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 text-royal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Services
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Comprehensive compliance validation tailored for technical institutions and regulatory scrutiny bodies.
          </p>
        </div>

        {/* 3 Horizontal Service Cards */}
        <div className="space-y-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-card-hover border border-slate-200/90 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-royal-300"
              >
                {/* Left: Icon & Core Details */}
                <div className="flex items-start sm:items-center gap-5 md:max-w-lg">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 flex items-center justify-center border ${service.iconBg} ${service.iconColor} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-royal-600 bg-royal-50 px-2 py-0.5 rounded border border-royal-100">
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-royal-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Right: Validation Checklist Tags */}
                <div className="flex-1 md:max-w-md bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Automated Inspection Scope
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {service.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
