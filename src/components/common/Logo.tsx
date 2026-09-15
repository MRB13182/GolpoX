import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_LOGO, BRAND_LOGO_STORAGE_PATH } from '../../config/branding';

interface LogoProps {
  variant?: 'full' | 'icon' | 'glass' | 'image-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  dark?: boolean;
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
  dark = false,
  priority = true,
}) => {
  let activeUrl = BRAND_LOGO;

  try {
    const app = useApp();
    if (app?.logoBranding?.url) {
      activeUrl = app.logoBranding.url;
    }
  } catch {
    // Fallback if rendered outside AppProvider
  }

  const [imageError, setImageError] = useState(false);

  // Size dimensions
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };

  const imageHeights = {
    sm: 'h-8 max-w-[150px]',
    md: 'h-9 sm:h-11 max-w-[180px] sm:max-w-[220px]',
    lg: 'h-12 sm:h-14 max-w-[260px]',
    xl: 'h-16 sm:h-20 max-w-[320px]',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // Fallback vector icon motif if image cannot load
  const renderFallbackIcon = () => (
    <div
      className={`relative flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/25 transition-transform duration-300 group-hover:scale-105 overflow-hidden ${
        iconSizes[size]
      } ${
        variant === 'glass'
          ? 'bg-gradient-to-br from-purple-500/90 via-purple-600/95 to-indigo-800/95 backdrop-blur-xl border border-white/40 shadow-purple-900/20'
          : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 border border-white/20'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent opacity-70 pointer-events-none" />
      <svg
        viewBox="0 0 24 24"
        className="w-3/5 h-3/5 text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20" />
        <path d="M6 6h10" strokeWidth="1.5" strokeOpacity="0.8" />
        <path d="M6 10h8" strokeWidth="1.5" strokeOpacity="0.8" />
      </svg>
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#F59E0B]" />
    </div>
  );

  // Master logo image display linked to BRAND_LOGO (public/logos/golpox-logo.png)
  if (!imageError) {
    if (variant === 'icon') {
      return (
        <div
          onClick={onClick}
          className={`inline-flex items-center justify-center cursor-pointer select-none group ${className}`}
          data-logo-id="GOLPOX_MAIN_LOGO"
          data-storage-path={BRAND_LOGO_STORAGE_PATH}
        >
          <div className={`${iconSizes[size]} overflow-hidden rounded-2xl flex items-center justify-center bg-white/10 p-1 border border-white/20 shadow-xs`}>
            <img
              src={activeUrl}
              alt="GolpoX Icon"
              className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      );
    }

    // Default 'full' or 'image-only' or 'glass'
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center cursor-pointer select-none group ${className}`}
        data-logo-id="GOLPOX_MAIN_LOGO"
        data-storage-path={BRAND_LOGO_STORAGE_PATH}
      >
        <img
          src={activeUrl}
          alt="GolpoX Logo"
          className={`${imageHeights[size]} w-auto object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.02]`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Graceful fallback if image fails to render
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group ${className}`}
      data-logo-id="GOLPOX_MAIN_LOGO"
      data-storage-path={BRAND_LOGO_STORAGE_PATH}
    >
      {renderFallbackIcon()}

      <div className="flex flex-col justify-center leading-none text-left">
        <div
          className={`font-black tracking-tight flex items-baseline font-sans transition-colors ${
            textSizes[size]
          } ${dark ? 'text-white' : 'text-slate-900'}`}
        >
          <span>Golpo</span>
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent ml-0.5">
            X
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-semibold tracking-wide font-bangla mt-0.5 ${
              taglineSizes[size]
            } ${dark ? 'text-purple-300' : 'text-purple-700/90'}`}
          >
            বাংলা সাহিত্যের ডিজিটাল দুনিয়া
          </span>
        )}
      </div>
    </div>
  );
};
