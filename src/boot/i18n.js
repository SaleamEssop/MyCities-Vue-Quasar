/**
 * i18n Boot File
 * 
 * Initializes vue-i18n for the application.
 * This boot file is registered in quasar.conf.js.
 * 
 * Note: vue-i18n is optional. If not installed or errors occur,
 * the app will still work but $t() calls will return the key.
 */

import { boot } from 'quasar/wrappers';
import { messages, DEFAULT_LOCALE, FALLBACK_LOCALE } from 'src/i18n';

let i18n = null;

export default boot(async ({ app }) => {
  try {
    // Dynamically import vue-i18n to handle potential import errors
    const { createI18n } = await import('vue-i18n');
    
    // Create i18n instance
    i18n = createI18n({
      locale: DEFAULT_LOCALE,
      fallbackLocale: FALLBACK_LOCALE,
      messages,
      legacy: false, // Use Composition API mode
      globalInjection: true, // Enable $t() in templates
    });
    
    // Set i18n instance on app
    app.use(i18n);
  } catch (error) {
    console.warn('vue-i18n not available, using fallback:', error.message);
    
    // Provide a simple fallback $t function that returns the key
    app.config.globalProperties.$t = (key) => {
      const keys = key.split('.');
      let result = messages[DEFAULT_LOCALE];
      for (const k of keys) {
        result = result?.[k];
      }
      return result || key;
    };
  }
});

export { i18n };

