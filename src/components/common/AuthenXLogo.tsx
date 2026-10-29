import React from 'react';

interface AuthenXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const AuthenXLogo: React.FC<AuthenXLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  light = false,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* AuthenX Shield Emblem */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="logoShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F2744" />
            </linearGradient>
            <linearGradient id="logoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Shield with gradient */}
          <path
            d="M24 4L7 11.2V22.8C7 33.6 14.3 43.4 24 45.4C33.7 43.4 41 33.6 41 22.8V11.2L24 4Z"
            fill="url(#logoShield)"
          />

          {/* Inner Shield facet */}
          <path
            d="M24 7.5L10.5 13.2V22.5C10.5 31.4 16.3 39.5 24 41.6C31.7 39.5 37.5 31.4 37.5 22.5V13.2L24 7.5Z"
            fill="#FFFFFF"
            fillOpacity="0.08"
          />

          {/* AI Nodes & Circuit paths */}
          <path
            d="M24 12V18M18 20L24 18L30 20"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="18" r="2" fill="#2DD4BF" />
          <circle cx="18" cy="20" r="1.5" fill="#93C5FD" />
          <circle cx="30" cy="20" r="1.5" fill="#93C5FD" />

          {/* Central Verification Checkmark */}
          <path
            d="M17 26.5L22 31.5L32 20.5"
            stroke="url(#logoAccent)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tech Sparkle Indicator */}
          <circle cx="34" cy="12" r="2.2" fill="#2DD4BF" filter="url(#glow)" />
        </svg>
      </div>

      {/* Brand Identity & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight font-sans ${titleSizes[size]} ${
              light ? 'text-white' : 'text-slate-900'
            }`}
          >
            Authen<span className="text-royal-500">X</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-blue-100 text-royal-700 border border-blue-200">
            AI
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[11px] font-medium tracking-wide uppercase ${
              light ? 'text-blue-200/80' : 'text-slate-500'
            }`}
          >
            Validate • Verify • Comply
          </span>
        )}
      </div>
    </div>
  );
};
