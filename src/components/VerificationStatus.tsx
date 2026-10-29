import React from 'react';
import { CheckCircle2, Clock, XCircle, UserCheck } from 'lucide-react';

export const VerificationStatus: React.FC = () => {
  const statuses = [
    {
      name: 'Verified',
      statusColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconBg: 'bg-emerald-500 text-white',
      icon: CheckCircle2,
      subtitle: 'Complete & Authenticated',
      description:
        'All required criteria, digital signatures, and authorized database hashes match AICTE norms without anomalies.',
      exampleTrigger: 'Land deed & Fire NOC hashes verified via DigiLocker.',
    },
    {
      name: 'Pending',
      statusColor: 'text-amber-700',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      iconBg: 'bg-amber-500 text-white',
      icon: Clock,
      subtitle: 'Processing in Progress',
      description:
        'Awaiting source repository response, OCR background processing, or secondary file uploads from the applicant.',
      exampleTrigger: 'State portal API sync queued or heavy image OCR in progress.',
    },
    {
      name: 'Mismatch Detected',
      statusColor: 'text-rose-700',
      bgColor: 'bg-rose-50/70',
      borderColor: 'border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      iconBg: 'bg-rose-500 text-white',
      icon: XCircle,
      subtitle: 'Discrepancy Flagged',
      description:
        'Discrepancy identified between self-declared application metrics and extracted document certificates or registry data.',
      exampleTrigger: 'Declared built-up area does not match approved municipal blueprint.',
    },
    {
      name: 'Manual Review Required',
      statusColor: 'text-purple-700',
      bgColor: 'bg-purple-50/70',
      borderColor: 'border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      iconBg: 'bg-purple-600 text-white',
      icon: UserCheck,
      subtitle: 'Expert Officer Escalation',
      description:
        'Complex borderline cases, handwritten notations, or ambiguous site photos routed to the Scrutiny Committee for human review.',
      exampleTrigger: 'Legacy cursive land agreement or low-resolution survey plan.',
    },
  ];

  return (
    <section id="status" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-royal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Regulatory Triage Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verification Status
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Understand the preliminary validation status of documents and applications.
          </p>
        </div>

        {/* 4 Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statuses.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 border ${item.borderColor} ${item.bgColor} shadow-card flex flex-col justify-between transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}
              >
                <div>
                  {/* Top Header with Icon & Status Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${item.badgeBg}`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Subtitle & Title */}
                  <h3 className={`text-lg font-bold mb-1 ${item.statusColor}`}>
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mb-3">
                    {item.subtitle}
                  </p>

                  {/* Main Description */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Example Trigger Callout */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Typical Trigger:
                  </span>
                  <p className="text-xs text-slate-600 italic bg-white/70 p-2 rounded-lg border border-slate-200/50">
                    "{item.exampleTrigger}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
