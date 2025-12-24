/**
 * @fileoverview Resource hints analysis module.
 */

import type { ResourceHintsAnalysis, SeoStatus } from '@/types/seo';

/**
 * Analyzes resource hints in the document.
 */
export function analyzeResourceHints(doc: Document): ResourceHintsAnalysis {
  const preload = Array.from(doc.querySelectorAll('link[rel="preload"]')).map(
    (el) => el.getAttribute('href') || '',
  );
  const prefetch = Array.from(doc.querySelectorAll('link[rel="prefetch"]')).map(
    (el) => el.getAttribute('href') || '',
  );
  const preconnect = Array.from(doc.querySelectorAll('link[rel="preconnect"]')).map(
    (el) => el.getAttribute('href') || '',
  );
  const dnsPrefetch = Array.from(doc.querySelectorAll('link[rel="dns-prefetch"]')).map(
    (el) => el.getAttribute('href') || '',
  );

  const hasResourceHints = preload.length > 0 || prefetch.length > 0 || preconnect.length > 0;
  const status: SeoStatus = hasResourceHints ? 'good' : 'info';

  return {
    preload,
    prefetch,
    preconnect,
    dnsPrefetch,
    hasResourceHints,
    status,
  };
}
