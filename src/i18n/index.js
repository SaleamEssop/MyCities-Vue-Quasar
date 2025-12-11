/**
 * i18n Configuration
 * 
 * Internationalization setup using vue-i18n.
 * Currently only English (US) is supported.
 * 
 * To add a new language:
 * 1. Create a new folder under src/i18n (e.g., src/i18n/af-ZA/)
 * 2. Copy en-US/index.js and translate all strings
 * 3. Import and add to messages object below
 * 4. Add locale to SUPPORTED_LOCALES
 */

import enUS from './en-US';

// Supported locales configuration
export const SUPPORTED_LOCALES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  // Add more locales here as needed:
  // { code: 'af-ZA', name: 'Afrikaans', flag: '🇿🇦' },
];

// Default locale
export const DEFAULT_LOCALE = 'en-US';

// Fallback locale (used when translation is missing)
export const FALLBACK_LOCALE = 'en-US';

// Messages object for vue-i18n
export const messages = {
  'en-US': enUS,
  // Add more languages here:
  // 'af-ZA': afZA,
};

export default messages;


