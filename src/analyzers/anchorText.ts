/**
 * @fileoverview Anchor text quality analysis module.
 */

import type { AnchorTextAnalysis, LinkItem, SeoStatus } from '@/types/seo';
import {
  ANCHOR_TEXT_MAX_LENGTH,
  ANCHOR_TEXT_MIN_LENGTH,
  GENERIC_ANCHOR_ERROR_THRESHOLD,
  GENERIC_ANCHOR_PHRASES,
  GENERIC_ANCHOR_WARNING_THRESHOLD,
  GENERIC_TEXTS_DISPLAY_LIMIT,
  OVER_OPTIMIZED_ANCHOR_WARNING_THRESHOLD,
} from '@/constants/seo';
import { t } from '@/utils/i18nHelper';

/**
 * Analyzes anchor text quality.
 */
export function analyzeAnchorText(links: LinkItem[]): AnchorTextAnalysis {
  let generic = 0;
  let descriptive = 0;
  let overOptimized = 0;
  const genericTexts: string[] = [];
  const issues: string[] = [];

  links.forEach((link) => {
    const text = link.text.toLowerCase().trim();

    if (!text || text.length < ANCHOR_TEXT_MIN_LENGTH) {
      return;
    }

    if (GENERIC_ANCHOR_PHRASES.some((phrase) => text === phrase || text.startsWith(phrase + ' '))) {
      generic++;
      if (!genericTexts.includes(link.text)) {
        genericTexts.push(link.text);
      }
    } else if (text.length > ANCHOR_TEXT_MAX_LENGTH) {
      overOptimized++;
    } else {
      descriptive++;
    }
  });

  const total = generic + descriptive + overOptimized;

  if (generic > total * GENERIC_ANCHOR_WARNING_THRESHOLD) {
    issues.push(t('seo.analyzers.anchorText.tooManyGeneric'));
  }
  if (overOptimized > total * OVER_OPTIMIZED_ANCHOR_WARNING_THRESHOLD) {
    issues.push(t('seo.analyzers.anchorText.tooLong'));
  }

  let status: SeoStatus = 'good';
  if (issues.length > 0) {
    status = 'warning';
  }
  if (generic > total * GENERIC_ANCHOR_ERROR_THRESHOLD) {
    status = 'error';
  }

  return {
    total,
    generic,
    descriptive,
    overOptimized,
    genericTexts: genericTexts.slice(0, GENERIC_TEXTS_DISPLAY_LIMIT),
    issues,
    status,
  };
}
