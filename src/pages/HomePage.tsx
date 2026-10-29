import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { Services } from '../components/Services';
import { VerificationStatus } from '../components/VerificationStatus';
import { KeyBenefits } from '../components/KeyBenefits';
import { DashboardPreview } from '../components/DashboardPreview';
import { FAQ } from '../components/FAQ';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-royal-600 selection:text-white">
      {/* 1. Navigation Bar */}
      <Navbar onNavigate={scrollToSection} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero onScrollTo={scrollToSection} />

        {/* 3. About AuthenX */}
        <About onScrollTo={scrollToSection} />

        {/* 4. Key Features */}
        <Features />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Our Services */}
        <Services />

        {/* 7. Verification Status */}
        <VerificationStatus />

        {/* 8. Key Benefits */}
        <KeyBenefits />

        {/* 9. Dashboard Preview */}
        <DashboardPreview onScrollTo={scrollToSection} />

        {/* 10. Frequently Asked Questions */}
        <FAQ />

        {/* 11. Final Call-to-Action */}
        <CTA onScrollTo={scrollToSection} />
      </main>

      {/* 12. Footer */}
      <Footer onScrollTo={scrollToSection} />
    </div>
  );
};
