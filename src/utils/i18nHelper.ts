/**
 * @fileoverview i18n helper for non-Vue code (analyzers, utilities).
 * Provides access to translations outside of Vue components.
 */

import { i18n } from '@/i18n';

type TranslationParams = Record<string, string | number>;

/**
 * Translates a key using the global i18n instance.
 * For use in non-Vue code like analyzers.
 */
export function t(key: string, params?: TranslationParams): string {
  return i18n.global.t(key, params ?? {});
}
