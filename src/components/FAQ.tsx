import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What types of documents can be validated?',
      answer:
        'AuthenX supports OCR extraction and validation for institutional land title deeds, building occupancy certificates, fire safety NOCs, society/trust registration deeds, university affiliation orders, faculty qualification certificates, and audited balance sheets required under AICTE Approval Process Handbook (APH) guidelines.',
    },
    {
      question: 'How does AI-powered validation work?',
      answer:
        'The platform ingests PDF and scanned image files, applies intelligent Optical Character Recognition (OCR) to extract structured key-value pairs, cross-checks dates, seals, and signatures, runs anomaly-detection models for document tampering or duplication, and matches extracted criteria against configured statutory norms.',
    },
    {
      question: 'Is AuthenX an official AICTE portal?',
      answer:
        'No. AuthenX is an experimental hackathon prototype developed for demonstration and research purposes. It is not an official AICTE service and does not have direct write access to government databases unless formally authorized and integrated by regulatory authorities.',
    },
    {
      question: 'How is application status determined?',
      answer:
        'An application status (Verified, Pending, Mismatch Detected, or Manual Review Required) is computed by aggregating individual document validation checkpoints, authorized database hash checks, and rule compliance scoring. A mismatch or deficiency in mandatory documents triggers an alert for scrutiny officers.',
    },
    {
      question: 'Can I track missing documents?',
      answer:
        'Yes. AuthenX generates an automated Deficiency & Missing Documents Matrix. It compares uploaded submissions against mandatory checklists specified for each application type (such as New Institution, Extension of Approval, or Course Intake Changes) and highlights missing certificates.',
    },
    {
      question: 'Does AI make the final approval decision?',
      answer:
        'No. AuthenX acts strictly as an AI-powered preliminary decision-support tool. It flags anomalies, verifies records, and prepares comprehensive scrutiny summaries. All final statutory approval decisions, inspections, and council orders remain exclusively with authorized AICTE committees and competent officials.',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 text-royal-700 text-xs font-bold tracking-wide uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-royal-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Learn more about how AuthenX assists in transparent, accurate application validation.
          </p>
        </div>

        {/* Working Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-royal-300 shadow-md ring-1 ring-royal-200/50'
                    : 'border-slate-200/80 shadow-subtle hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-lg font-bold transition-colors ${
                      isOpen ? 'text-royal-600' : 'text-slate-800'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-royal-50 text-royal-600 rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hackathon Prototype Transparency Banner */}
        <div className="mt-12 p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start sm:items-center gap-3 text-xs sm:text-sm text-slate-700">
          <ShieldAlert className="w-5 h-5 text-royal-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-slate-900">Prototype Transparency Note:</strong> AuthenX is a hackathon
            prototype created for architectural and validation capability demonstration. It is not an
            official AICTE service unless formally adopted by competent authorities.
          </p>
        </div>
      </div>
    </section>
  );
};
