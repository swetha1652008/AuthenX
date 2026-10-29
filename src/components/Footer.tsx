import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Info,
  CheckCircle2,
  Send
} from 'lucide-react';
import { AuthenXLogo } from './common/AuthenXLogo';

interface FooterProps {
  onScrollTo?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleModalOpen = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setEmailInput('');
    }, 4000);
  };

  return (
    <>
      <footer id="contact" className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
            {/* Column 1: AuthenX Logo, Tagline, Mission (Col span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <AuthenXLogo size="md" light showTagline />
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm pt-2">
                Empowering technical education institutions and regulatory scrutiny bodies with AI-driven
                document authentication, anomaly detection, and automated compliance verification.
              </p>

              {/* Prototype Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-[11px] text-teal-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>AICTE Hackathon Demo Prototype</span>
              </div>
            </div>

            {/* Column 2: Quick Links (Col span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => handleLinkClick(e, 'home')}
                    className="hover:text-royal-400 transition-colors inline-block py-0.5"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleLinkClick(e, 'about')}
                    className="hover:text-royal-400 transition-colors inline-block py-0.5"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => handleLinkClick(e, 'features')}
                    className="hover:text-royal-400 transition-colors inline-block py-0.5"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleLinkClick(e, 'how-it-works')}
                    className="hover:text-royal-400 transition-colors inline-block py-0.5"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleLinkClick(e, 'services')}
                    className="hover:text-royal-400 transition-colors inline-block py-0.5"
                  >
                    Our Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support (Col span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Support & Inquiries
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => handleLinkClick(e, 'faq')}
                    className="hover:text-royal-400 transition-colors inline-block py-0.5"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleModalOpen(
                        'Help Center & Documentation',
                        'AuthenX Documentation includes sample application checklists, OCR file format guidelines (PDF, JPG up to 25MB), verification rule definitions for AICTE Approval Process Handbook (APH), and Scrutiny Officer manual workflows.'
                      )
                    }
                    className="hover:text-royal-400 transition-colors inline-block py-0.5 text-left cursor-pointer"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleModalOpen(
                        'Contact Regulatory Desk',
                        'For platform demonstration inquiries and technical consultation regarding the AuthenX validation engine, contact our prototype research team at demo-support@authenx.internal or reach out to the hackathon coordinator.'
                      )
                    }
                    className="hover:text-royal-400 transition-colors inline-block py-0.5 text-left cursor-pointer"
                  >
                    Contact Scrutiny Desk
                  </button>
                </li>
              </ul>

              {/* Direct Mock Contact Info */}
              <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>support@authenx-demo.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Nelson Mandela Marg, New Delhi 110070</span>
                </div>
              </div>
            </div>

            {/* Column 4: Legal & Project Information (Col span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Legal & Project Info
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleModalOpen(
                        'Privacy Policy',
                        'This demonstration environment simulates document OCR and verification without persistent storage of sensitive institutional data. All uploaded application tokens and sample files are sandboxed for session duration only.'
                      )
                    }
                    className="hover:text-royal-400 transition-colors inline-block py-0.5 text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleModalOpen(
                        'Terms of Use',
                        'AuthenX is provided on an AS-IS basis for evaluation, architectural demonstration, and research. Automated findings do not constitute official statutory decisions or binding legal certifications.'
                      )
                    }
                    className="hover:text-royal-400 transition-colors inline-block py-0.5 text-left cursor-pointer"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleModalOpen(
                        'Project Architecture Information',
                        'AuthenX Architecture incorporates multimodal OCR extraction, schema normalizers, rule-engine verification against AICTE norms, and automated decision-support reporting for scrutiny panels.'
                      )
                    }
                    className="hover:text-royal-400 transition-colors inline-block py-0.5 text-left cursor-pointer"
                  >
                    Project Information
                  </button>
                </li>
              </ul>

              {/* Quick Updates Form */}
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-1.5">Request Pilot Demo Access:</p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="officer@institute.edu"
                    className="bg-navy-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 flex-1 focus:outline-none focus:border-royal-500"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 bg-royal-600 hover:bg-royal-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                    title="Submit"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
                {contactSubmitted && (
                  <p className="text-[10px] text-teal-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Demo request registered!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Statutory Disclaimer & Copyright Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            {/* Prominently Stated Mandatory Disclaimer */}
            <div className="flex items-start sm:items-center gap-2 text-slate-400 max-w-2xl text-center md:text-left">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p>
                <strong className="text-slate-300">Disclaimer:</strong> AuthenX is a hackathon prototype
                developed for demonstration and is not an official AICTE service.
              </p>
            </div>

            {/* Copyright */}
            <div className="text-slate-500 text-center md:text-right font-medium">
              © 2026 AuthenX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Reusable Informational Modal for Legal/Support items */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <Info className="w-5 h-5 text-royal-600 flex-shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">{modalTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {modalContent}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalTitle(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-navy-800 hover:bg-royal-600 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
