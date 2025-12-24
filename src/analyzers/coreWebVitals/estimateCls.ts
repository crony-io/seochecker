/**
 * @fileoverview CLS (Cumulative Layout Shift) estimation from HTML structure.
 */

import { CWV_SCORE_GOOD, CWV_SCORE_NEEDS_IMPROVEMENT } from '@/constants/seo';

import type { ClsEstimate, ClsFactor } from './types';

/**
 * Estimates CLS risk from HTML structure.
 */
export function estimateCls(doc: Document): ClsEstimate {
  const factors: ClsFactor[] = [];
  const issues: string[] = [];
  let score = 100;

  // Check for images without dimensions
  const imagesWithoutDimensions = doc.querySelectorAll(
    'img:not([width]):not([height]):not([style*="width"]):not([style*="height"])',
  );

  if (imagesWithoutDimensions.length > 0) {
    factors.push({
      factor: 'Images without dimensions',
      impact: 'negative',
      count: imagesWithoutDimensions.length,
    });
    issues.push('Add width and height attributes to images to prevent layout shifts');
    score -= imagesWithoutDimensions.length * 5;
  } else {
    factors.push({
      factor: 'Images with dimensions',
      impact: 'positive',
      count: doc.querySelectorAll('img[width][height]').length,
    });
  }

  // Check for iframes without dimensions
  const iframesWithoutDimensions = doc.querySelectorAll('iframe:not([width]):not([height])');

  if (iframesWithoutDimensions.length > 0) {
    factors.push({
      factor: 'Iframes without dimensions',
      impact: 'negative',
      count: iframesWithoutDimensions.length,
    });
    issues.push('Add dimensions to iframes to prevent layout shifts');
    score -= iframesWithoutDimensions.length * 8;
  }

  // Check for ads/embeds containers
  const adContainers = doc.querySelectorAll(
    '[class*="ad-"], [class*="ads-"], [id*="ad-"], .advertisement, .ad-slot',
  );

  if (adContainers.length > 0) {
    // Check if they have min-height
    const withMinHeight = Array.from(adContainers).filter((el) => {
      const style = el.getAttribute('style') || '';
      return style.includes('min-height') || style.includes('height');
    });

    if (withMinHeight.length < adContainers.length) {
      factors.push({
        factor: 'Ad containers without reserved space',
        impact: 'negative',
        count: adContainers.length - withMinHeight.length,
      });
      issues.push('Reserve space for ad containers to prevent layout shifts');
      score -= 10;
    }
  }

  // Check for dynamically injected content patterns
  const dynamicContainers = doc.querySelectorAll(
    '[data-dynamic], [data-async-content], .skeleton, .placeholder',
  );

  if (dynamicContainers.length > 0) {
    factors.push({
      factor: 'Dynamic content placeholders',
      impact: 'positive',
      count: dynamicContainers.length,
    });
    score += 5;
  }

  // Check for font display
  const fontDisplaySwap = /@font-face[^}]*font-display:\s*swap/gi.test(
    Array.from(doc.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join(''),
  );

  if (fontDisplaySwap) {
    factors.push({
      factor: 'Font display swap',
      impact: 'positive',
      count: 1,
    });
  }

  // Determine estimate
  let estimate: ClsEstimate['estimate'] = 'unknown';
  if (score >= CWV_SCORE_GOOD) {
    estimate = 'good';
  } else if (score >= CWV_SCORE_NEEDS_IMPROVEMENT) {
    estimate = 'needs-improvement';
  } else {
    estimate = 'poor';
  }

  return { estimate, factors, issues };
}
