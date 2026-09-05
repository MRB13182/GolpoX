import { LogoBranding } from '../types';

export const GOLPOX_LOGO_SOURCE_ID = 'GOLPOX_MAIN_LOGO' as const;
export const GOLPOX_LOGO_STORAGE_PATH = 'assets/branding/golpox-main-logo' as const;
export const GOLPOX_DEFAULT_LOGO_URL = '/assets/branding/golpox-main-logo';

const LOCAL_STORAGE_KEY = 'golpox_branding_main_logo_v1';

export const DEFAULT_LOGO_BRANDING: LogoBranding = {
  id: GOLPOX_LOGO_SOURCE_ID,
  storagePath: GOLPOX_LOGO_STORAGE_PATH,
  url: GOLPOX_DEFAULT_LOGO_URL,
  fileName: 'golpox-main-logo.svg',
  fileType: 'image/svg+xml',
  format: 'SVG',
  fileSizeBytes: 1613,
  width: 280,
  height: 80,
  lastUpdated: new Date().toISOString(),
  isCustom: false,
};

export const SUPPORTED_LOGO_FORMATS = ['PNG', 'SVG', 'WEBP'] as const;
export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/svg+xml',
  'image/webp',
];

/**
 * Retrieves the currently saved branding logo or defaults to the single source logo.
 */
export const getStoredLogoBranding = (): LogoBranding => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id === GOLPOX_LOGO_SOURCE_ID) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Branding] Failed to read stored logo from localStorage:', err);
  }
  return DEFAULT_LOGO_BRANDING;
};

/**
 * Saves branding logo to persistent storage and updates document head tags.
 */
export const saveLogoBranding = (branding: LogoBranding): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(branding));
    syncHeadBrandingMetadata(branding.url);
  } catch (err) {
    console.error('[Branding] Failed to save logo to localStorage:', err);
  }
};

/**
 * Resets logo to default single source file.
 */
export const resetLogoBranding = (): LogoBranding => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    syncHeadBrandingMetadata(DEFAULT_LOGO_BRANDING.url);
  } catch (err) {
    console.warn('[Branding] Failed to clear custom logo:', err);
  }
  return {
    ...DEFAULT_LOGO_BRANDING,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Reads and validates an uploaded logo file (PNG, SVG, WEBP).
 */
export const processLogoUpload = async (file: File): Promise<LogoBranding> => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  let format: 'PNG' | 'SVG' | 'WEBP' = 'PNG';
  let mimeType = file.type;

  if (extension === 'svg' || file.type.includes('svg')) {
    format = 'SVG';
    mimeType = 'image/svg+xml';
  } else if (extension === 'webp' || file.type.includes('webp')) {
    format = 'WEBP';
    mimeType = 'image/webp';
  } else if (extension === 'png' || file.type.includes('png')) {
    format = 'PNG';
    mimeType = 'image/png';
  } else {
    throw new Error(
      `Unsupported format: .${extension}. Supported formats are PNG, SVG, and WEBP.`
    );
  }

  // File size limit (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5MB limit. Please upload a smaller logo.');
  }

  // Read file as Data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  // Calculate natural image dimensions
  const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 280, height: img.naturalHeight || 80 });
    };
    img.onerror = () => {
      resolve({ width: 280, height: 80 });
    };
    img.src = dataUrl;
  });

  const newBranding: LogoBranding = {
    id: GOLPOX_LOGO_SOURCE_ID,
    storagePath: GOLPOX_LOGO_STORAGE_PATH,
    url: dataUrl,
    fileName: file.name,
    fileType: mimeType,
    format,
    fileSizeBytes: file.size,
    width: dimensions.width,
    height: dimensions.height,
    lastUpdated: new Date().toISOString(),
    isCustom: true,
  };

  saveLogoBranding(newBranding);
  return newBranding;
};

/**
 * Automatically synchronizes website head elements:
 * - Browser Favicon
 * - App Icon (apple-touch-icon)
 * - SEO logo metadata
 * - Open Graph logo
 * - Social share logo (twitter:image)
 * - Schema.org JSON-LD Organization
 */
export const syncHeadBrandingMetadata = (logoUrl: string): void => {
  if (typeof document === 'undefined') return;

  const resolvedUrl = logoUrl.startsWith('data:') 
    ? logoUrl 
    : (typeof window !== 'undefined' ? `${window.location.origin}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}` : logoUrl);

  // 1. Browser Favicon
  let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = logoUrl;
  if (logoUrl.endsWith('.svg') || logoUrl.startsWith('data:image/svg+xml')) {
    favicon.type = 'image/svg+xml';
  } else if (logoUrl.endsWith('.png') || logoUrl.startsWith('data:image/png')) {
    favicon.type = 'image/png';
  } else if (logoUrl.endsWith('.webp') || logoUrl.startsWith('data:image/webp')) {
    favicon.type = 'image/webp';
  }

  // 2. Apple Touch Icon / App Icon placeholder
  let appleTouchIcon = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
  if (!appleTouchIcon) {
    appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    document.head.appendChild(appleTouchIcon);
  }
  appleTouchIcon.href = logoUrl;

  // 3. SEO logo metadata
  let seoLogoMeta = document.querySelector<HTMLMetaElement>("meta[name='logo']");
  if (!seoLogoMeta) {
    seoLogoMeta = document.createElement('meta');
    seoLogoMeta.name = 'logo';
    document.head.appendChild(seoLogoMeta);
  }
  seoLogoMeta.content = resolvedUrl;

  // 4. Open Graph logo
  let ogImageMeta = document.querySelector<HTMLMetaElement>("meta[property='og:image']");
  if (!ogImageMeta) {
    ogImageMeta = document.createElement('meta');
    ogImageMeta.setAttribute('property', 'og:image');
    document.head.appendChild(ogImageMeta);
  }
  ogImageMeta.content = resolvedUrl;

  // 5. Twitter / Social Share logo
  let twitterImageMeta = document.querySelector<HTMLMetaElement>("meta[name='twitter:image']");
  if (!twitterImageMeta) {
    twitterImageMeta = document.createElement('meta');
    twitterImageMeta.name = 'twitter:image';
    document.head.appendChild(twitterImageMeta);
  }
  twitterImageMeta.content = resolvedUrl;

  // 6. Schema.org JSON-LD Structured Data
  let schemaScript = document.getElementById('schema-org-branding') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'schema-org-branding';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GolpoX',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://golpox.com',
    logo: resolvedUrl,
    description: 'GolpoX - Premium Bangla & Multilingual Literary Ecosystem',
  });
};
