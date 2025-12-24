/**
 * @fileoverview Lazy loading and infinite scroll detection.
 */

import type { SeoStatus, LazyContentAnalysis } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

export type { LazyContentAnalysis };

const INFINITE_SCROLL_PATTERNS = [
  { pattern: /infinite[\s-_]?scroll/i, name: 'Infinite scroll class/ID' },
  { pattern: /load[\s-_]?more/i, name: 'Load more pattern' },
  { pattern: /IntersectionObserver/i, name: 'IntersectionObserver API' },
  { pattern: /scroll[\s-_]?trigger/i, name: 'Scroll trigger' },
  { pattern: /lazy[\s-_]?load/i, name: 'Lazy load pattern' },
  { pattern: /waypoint/i, name: 'Waypoint library' },
  { pattern: /infinite\.js/i, name: 'Infinite.js library' },
  { pattern: /endless[\s-_]?scroll/i, name: 'Endless scroll' },
];

const LAZY_LOADING_LIBS = [
  { pattern: /lazysizes/i, name: 'lazysizes' },
  { pattern: /lozad/i, name: 'lozad.js' },
  { pattern: /vanilla-lazyload/i, name: 'vanilla-lazyload' },
  { pattern: /blazy/i, name: 'bLazy' },
];

/**
 * Analyzes lazy loading and infinite scroll patterns.
 */
export function analyzeLazyContent(doc: Document, html: string): LazyContentAnalysis {
  const infiniteScrollPatterns: string[] = [];
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Detect infinite scroll patterns
  INFINITE_SCROLL_PATTERNS.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      infiniteScrollPatterns.push(name);
    }
  });

  // Check for IntersectionObserver usage
  const hasIntersectionObserver = /IntersectionObserver/i.test(html);

  // Detect lazy loading libraries
  LAZY_LOADING_LIBS.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      infiniteScrollPatterns.push(`${name} library`);
    }
  });

  // Check for elements with infinite scroll data attributes or classes
  const infiniteElements = doc.querySelectorAll(
    '[data-infinite], [data-infinite-scroll], .infinite-scroll, .load-more, [data-load-more]',
  );
  if (infiniteElements.length > 0) {
    infiniteScrollPatterns.push(t('seo.lazyContent.analyzers.infiniteScrollDataAttrs'));
  }

  const hasInfiniteScroll = infiniteScrollPatterns.length > 0;

  // Detect lazy loaded images
  const lazyImages = doc.querySelectorAll(
    'img[loading="lazy"], img[data-src], img[data-lazy], img.lazyload, img.lazy',
  );
  const hasLazyImages = lazyImages.length > 0;
  const lazyImageCount = lazyImages.length;

  // Also count native lazy loading
  const nativeLazyImages = doc.querySelectorAll('img[loading="lazy"]');

  // Detect lazy loaded iframes
  const lazyIframes = doc.querySelectorAll(
    'iframe[loading="lazy"], iframe[data-src], iframe.lazyload',
  );
  const hasLazyIframes = lazyIframes.length > 0;
  const lazyIframeCount = lazyIframes.length;

  // Detect pagination (good for SEO)
  const paginationSelectors = [
    '.pagination a',
    '.pager a',
    'nav[aria-label*="pagination"] a',
    '[class*="pagination"] a',
    'a[rel="next"]',
    'a[rel="prev"]',
  ];

  const paginationLinks: string[] = [];
  paginationSelectors.forEach((selector) => {
    try {
      const links = doc.querySelectorAll(selector);
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !paginationLinks.includes(href)) {
          paginationLinks.push(href);
        }
      });
    } catch {
      // Invalid selector, skip
    }
  });

  const hasPagination = paginationLinks.length > 0;

  // Generate issues and recommendations
  if (hasInfiniteScroll && !hasPagination) {
    issues.push(t('seo.lazyContent.analyzers.infiniteScrollNoPagination'));
    recommendations.push(t('seo.lazyContent.analyzers.infiniteScrollSeoRecommendation'));
  }

  if (hasInfiniteScroll) {
    recommendations.push(t('seo.lazyContent.analyzers.infiniteScrollAccessibility'));
  }

  if (!hasLazyImages && doc.querySelectorAll('img').length > 5) {
    recommendations.push(t('seo.lazyContent.analyzers.considerLazyImages'));
  }

  if (nativeLazyImages.length < lazyImageCount && lazyImageCount > 0) {
    recommendations.push(t('seo.lazyContent.analyzers.useNativeLazy'));
  }

  // Determine status
  let status: SeoStatus = 'good';
  if (hasInfiniteScroll && !hasPagination) {
    status = 'warning';
  }
  if (issues.length > 1) {
    status = 'error';
  }

  return {
    hasInfiniteScroll,
    infiniteScrollPatterns,
    hasLazyImages,
    lazyImageCount,
    hasLazyIframes,
    lazyIframeCount,
    hasIntersectionObserver,
    hasPagination,
    paginationLinks: paginationLinks.slice(0, 10), // Limit to 10
    issues,
    recommendations,
    status,
  };
}
