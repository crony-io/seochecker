/**
 * @fileoverview LCP (Largest Contentful Paint) estimation from HTML structure.
 */

import {
  BLOCKING_SCRIPTS_MAX,
  BLOCKING_STYLESHEETS_MAX,
  CWV_SCORE_GOOD,
  CWV_SCORE_NEEDS_IMPROVEMENT,
  HTML_SIZE_LARGE,
} from '@/constants/seo';

import type { LcpEstimate, LcpFactor } from './types';

/**
 * Estimates LCP performance from HTML structure.
 */
export function estimateLcp(doc: Document, html: string): LcpEstimate {
  const factors: LcpFactor[] = [];
  const issues: string[] = [];
  let score = 100;

  // Check for large hero images
  const heroImages = doc.querySelectorAll(
    'img[class*="hero"], img[class*="banner"], .hero img, .banner img, header img',
  );
  const allImages = doc.querySelectorAll('img');

  // Check for preload of LCP candidate
  const preloadedImages = doc.querySelectorAll('link[rel="preload"][as="image"]');
  if (preloadedImages.length > 0) {
    factors.push({
      factor: 'Image preload',
      impact: 'positive',
      description: 'LCP candidate may be preloaded',
    });
    score += 10;
  }

  // Check for lazy loading on above-fold images
  const firstImages = Array.from(allImages).slice(0, 3);
  const lazyLoadedFirstImages = firstImages.filter((img) => img.getAttribute('loading') === 'lazy');

  if (lazyLoadedFirstImages.length > 0) {
    factors.push({
      factor: 'Lazy loading above fold',
      impact: 'negative',
      description: 'First images use lazy loading, which may delay LCP',
    });
    issues.push('Consider removing lazy loading from above-the-fold images');
    score -= 15;
  }

  // Check for fetchpriority
  const highPriorityImages = doc.querySelectorAll('img[fetchpriority="high"]');
  if (highPriorityImages.length > 0) {
    factors.push({
      factor: 'Fetch priority',
      impact: 'positive',
      description: 'High priority set on important images',
    });
    score += 10;
  }

  // Check for render-blocking resources
  const blockingStyles = doc.querySelectorAll('link[rel="stylesheet"]:not([media="print"])');
  const blockingScripts = doc.querySelectorAll(
    'script:not([async]):not([defer]):not([type="module"])',
  );

  if (blockingStyles.length > BLOCKING_STYLESHEETS_MAX) {
    factors.push({
      factor: 'Blocking stylesheets',
      impact: 'negative',
      description: `${blockingStyles.length} render-blocking stylesheets`,
    });
    issues.push('Consider reducing or deferring non-critical CSS');
    score -= blockingStyles.length * 3;
  }

  if (blockingScripts.length > BLOCKING_SCRIPTS_MAX) {
    factors.push({
      factor: 'Blocking scripts',
      impact: 'negative',
      description: `${blockingScripts.length} render-blocking scripts`,
    });
    issues.push('Add async or defer to non-critical scripts');
    score -= blockingScripts.length * 5;
  }

  // Check for inline critical CSS
  const inlineStyles = doc.querySelectorAll('style');
  const firstStyle = inlineStyles[0];
  if (firstStyle) {
    const content = firstStyle.textContent || '';
    if (content.length > 500 && content.length < 15000) {
      factors.push({
        factor: 'Inline critical CSS',
        impact: 'positive',
        description: 'Critical CSS appears to be inlined',
      });
      score += 5;
    }
  }

  // Check for large HTML size
  if (html.length > HTML_SIZE_LARGE) {
    factors.push({
      factor: 'Large HTML',
      impact: 'negative',
      description: 'HTML size may delay rendering',
    });
    issues.push('Consider reducing HTML size');
    score -= 10;
  }

  // Determine LCP candidate
  let largestElement: string | null = null;
  const heroImg = heroImages[0];
  if (heroImg) {
    largestElement = `img[src="${heroImg.getAttribute('src')?.slice(0, 50)}..."]`;
  } else {
    const h1 = doc.querySelector('h1');
    if (h1) {
      largestElement = 'h1 (text)';
    }
  }

  // Determine estimate
  let estimate: LcpEstimate['estimate'] = 'unknown';
  if (score >= CWV_SCORE_GOOD) {
    estimate = 'good';
  } else if (score >= CWV_SCORE_NEEDS_IMPROVEMENT) {
    estimate = 'needs-improvement';
  } else if (score < 50) {
    estimate = 'poor';
  }

  return { estimate, factors, largestElement, issues };
}
