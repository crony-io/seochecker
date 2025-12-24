import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';

import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';

export type SupportedLocale = 'en' | 'es';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
];

export const STORAGE_KEY = makeStorageKey('i18n', 'locale');

const persistedLocaleV1Schema = z.object({
  schemaVersion: z.literal(1),
  locale: z.string(),
});

type PersistedLocaleV1 = z.infer<typeof persistedLocaleV1Schema>;

const localeStorage = createVersionedLocalStorage<PersistedLocaleV1>({
  key: STORAGE_KEY,
  latestVersion: 1,
  schemas: {
    1: persistedLocaleV1Schema,
  },
  legacyKeys: ['seocheck-locale'],
  coerce: (input) => {
    if (typeof input === 'string') {
      return { schemaVersion: 1, locale: input };
    }

    if (typeof input === 'object' && input !== null) {
      const value = input as { schemaVersion?: unknown; locale?: unknown };
      if (value.schemaVersion == null && typeof value.locale === 'string') {
        return { schemaVersion: 1, locale: value.locale };
      }
    }

    return undefined;
  },
});

function getBrowserLocale(): string | null {
  try {
    if (typeof navigator === 'undefined') {
      return null;
    }
    return (
      navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || null
    );
  } catch {
    return null;
  }
}

function normalizeLocale(locale: string): string {
  return locale.split('-')[0] || locale;
}

export function detectInitialLocale(
  availableLocales: readonly string[],
  fallbackLocale: string = 'en',
): string {
  const stored = localeStorage.read();
  const storedLocale = stored?.locale;
  if (storedLocale && availableLocales.includes(storedLocale)) {
    return storedLocale;
  }

  const browserLocale = getBrowserLocale();
  if (browserLocale) {
    const normalized = normalizeLocale(browserLocale);
    if (availableLocales.includes(normalized)) {
      return normalized;
    }
  }

  return fallbackLocale;
}

export function getLocaleInfo(localeCode: string): LocaleInfo | undefined {
  return SUPPORTED_LOCALES.find((l) => l.code === localeCode);
}

export function isLocaleRTL(localeCode: string): boolean {
  return getLocaleInfo(localeCode)?.rtl ?? false;
}

export function applyDocumentLocale(localeCode: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = localeCode;
  document.documentElement.dir = isLocaleRTL(localeCode) ? 'rtl' : 'ltr';
}

/**
 * Unified locale composable that handles all locale-related functionality.
 */
export function useLocale() {
  const i18n = useI18n();
  const currentLocale = computed(() => i18n.locale.value as SupportedLocale);

  const isRTL = computed(() => isLocaleRTL(currentLocale.value));

  const availableLocales = computed(() => {
    const localeCodes = i18n.availableLocales;
    return SUPPORTED_LOCALES.filter((l) => localeCodes.includes(l.code));
  });

  const setLocale = async (newLocale: SupportedLocale): Promise<boolean> => {
    try {
      if (!i18n.availableLocales.includes(newLocale)) {
        return false;
      }

      i18n.locale.value = newLocale;
      localeStorage.write({ schemaVersion: 1, locale: newLocale });
      applyDocumentLocale(newLocale);

      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to switch language:', error);
      }
      return false;
    }
  };

  const initLocale = () => {
    const initialLocale = detectInitialLocale(i18n.availableLocales, i18n.locale.value);
    if (i18n.availableLocales.includes(initialLocale)) {
      i18n.locale.value = initialLocale;
    }
    applyDocumentLocale(i18n.locale.value);
  };

  return {
    currentLocale,
    isRTL,
    setLocale,
    initLocale,
    getLocaleInfo,
    availableLocales,
  };
}
