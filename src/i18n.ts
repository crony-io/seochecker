import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import { applyDocumentLocale, detectInitialLocale } from '@/composables/useI18n';

// Detect browser language
const messages = { en, es } as const;
const supportedLocales = Object.keys(messages);
const initialLocale = detectInitialLocale(supportedLocales, 'en');

export const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: initialLocale, // detect browser language
  fallbackLocale: 'en', // fallback locale
  messages,
  globalInjection: true, // makes $t available in all components
  silentTranslationWarn: false,
  missingWarn: false,
  fallbackWarn: false,
});

applyDocumentLocale(initialLocale);

export default i18n;
