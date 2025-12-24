/**
 * @fileoverview Performance analysis module.
 */

import type { PerformanceAnalysis, SeoStatus } from '@/types/seo';
import {
  BLOCKING_RESOURCES_MAX,
  DOM_ELEMENTS_GOOD,
  DOM_ELEMENTS_WARNING,
  HTML_SIZE_GOOD,
  HTML_SIZE_WARNING,
} from '@/constants/seo';

/**
 * Analyzes page performance indicators.
 */
export function analyzePerformance(
  htmlSize: number,
  domData: { elements: number; maxDepth: number },
  scripts: { external: number; inline: number; async: number; defer: number },
  styles: { external: number; inline: number },
): PerformanceAnalysis {
  const blockingResources = scripts.external - scripts.async - scripts.defer + styles.external;

  const status: SeoStatus =
    domData.elements <= DOM_ELEMENTS_GOOD &&
    htmlSize <= HTML_SIZE_GOOD &&
    blockingResources <= BLOCKING_RESOURCES_MAX
      ? 'good'
      : domData.elements <= DOM_ELEMENTS_WARNING || htmlSize <= HTML_SIZE_WARNING
        ? 'warning'
        : 'error';

  return {
    htmlSize,
    domElements: domData.elements,
    domDepth: domData.maxDepth,
    scriptsCount: scripts.external + scripts.inline,
    stylesheetsCount: styles.external,
    inlineScripts: scripts.inline,
    inlineStyles: styles.inline,
    blockingResources: Math.max(0, blockingResources),
    status,
  };
}
