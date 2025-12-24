/**
 * @fileoverview Technical SEO analysis module.
 */

import type { MetaTags, SeoStatus, TechnicalAnalysis } from '@/types/seo';
import { TECHNICAL_CHECKS_GOOD, TECHNICAL_CHECKS_WARNING } from '@/constants/seo';
import { normalizeUrl } from '@/utils/corsProxy';
import type { checkTechnicalElements } from '@/composables/useHtmlParser';

/**
 * Analyzes technical SEO elements.
 */
export function analyzeTechnical(
  url: string,
  meta: MetaTags,
  technicalChecks: ReturnType<typeof checkTechnicalElements>,
): TechnicalAnalysis {
  const normalizedUrl = normalizeUrl(url);
  const isHttps = normalizedUrl.startsWith('https://');
  const urlLength = normalizedUrl.length;

  const checks = [
    technicalChecks.hasDoctype,
    technicalChecks.hasCharset,
    technicalChecks.hasViewport,
    meta.canonical !== null,
    isHttps,
    meta.language !== null,
  ];

  const passedChecks = checks.filter(Boolean).length;
  const status: SeoStatus =
    passedChecks >= TECHNICAL_CHECKS_GOOD
      ? 'good'
      : passedChecks >= TECHNICAL_CHECKS_WARNING
        ? 'warning'
        : 'error';

  return {
    hasDoctype: technicalChecks.hasDoctype,
    hasCharset: technicalChecks.hasCharset,
    hasViewport: technicalChecks.hasViewport,
    hasCanonical: meta.canonical !== null,
    hasHreflang: technicalChecks.hasHreflang,
    hasFavicon: technicalChecks.hasFavicon,
    isHttps,
    hasLanguage: meta.language !== null,
    urlLength,
    status,
  };
}
