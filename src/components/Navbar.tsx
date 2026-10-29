import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, ChevronRight } from 'lucide-react';
import { AuthenXLogo } from './common/AuthenXLogo';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Features', href: '#features', id: 'features' },
  { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { name: 'Services', href: '#services', id: 'services' },
  { name: 'FAQ', href: '#faq', id: 'faq' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active link spy
      const sections = NAV_LINKS.map(link => document.getElementById(link.id));
      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo & Tagline */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.01]"
            >
              <AuthenXLogo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors relative ${
                      isActive
                        ? 'text-royal-600 bg-royal-50/80 font-bold'
                        : 'text-slate-600 hover:text-royal-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-royal-600 rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right: Login Button (visual button as specified) */}
            <div className="hidden sm:flex items-center gap-3 relative">
              <button
                type="button"
                onClick={handleLoginClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-navy-800 hover:bg-royal-600 active:scale-95 transition-all duration-200 shadow-sm hover:shadow group cursor-pointer"
                title="Institutional & Scrutiny Portal Login"
              >
                <LogIn className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                <span>Login</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden gap-2">
              <button
                type="button"
                onClick={handleLoginClick}
                className="sm:hidden px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-navy-800"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-royal-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`flex items-center justify-between px-4 py-2.5 text-base font-semibold rounded-lg transition-colors ${
                    activeSection === link.id
                      ? 'text-royal-600 bg-royal-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 mt-3">
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-navy-800 hover:bg-royal-600 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4 text-teal-400" />
                <span>Portal Login</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
