/**
 * @fileoverview Core Web Vitals estimation from HTML analysis.
 * Note: These are estimates based on HTML patterns, not actual measurements.
 */

import type { SeoStatus } from '@/types/seo';
import {
  CWV_SCORE_GOOD,
  CWV_SCORE_NEEDS_IMPROVEMENT,
  BLOCKING_STYLESHEETS_MAX,
  BLOCKING_SCRIPTS_MAX,
  EXTERNAL_SCRIPTS_MAX,
  INLINE_SCRIPT_SIZE_MAX,
  HTML_SIZE_LARGE,
} from '@/constants/seo';

export interface CoreWebVitalsAnalysis {
  lcp: LcpEstimate;
  cls: ClsEstimate;
  fid: FidEstimate;
  inp: InpEstimate;
  overallStatus: SeoStatus;
  recommendations: string[];
}

export interface LcpEstimate {
  estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  factors: LcpFactor[];
  largestElement: string | null;
  issues: string[];
}

export interface LcpFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface ClsEstimate {
  estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  factors: ClsFactor[];
  issues: string[];
}

export interface ClsFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  count: number;
}

export interface FidEstimate {
  estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  factors: string[];
  issues: string[];
}

export interface InpEstimate {
  estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  factors: string[];
  issues: string[];
}

/**
 * Estimates LCP performance from HTML structure.
 */
function estimateLcp(doc: Document, html: string): LcpEstimate {
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

/**
 * Estimates CLS risk from HTML structure.
 */
function estimateCls(doc: Document): ClsEstimate {
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

/**
 * Estimates FID/INP risk from HTML structure.
 */
function estimateInteractivity(
  doc: Document,
  html: string,
): { fid: FidEstimate; inp: InpEstimate } {
  const fidFactors: string[] = [];
  const fidIssues: string[] = [];
  const inpFactors: string[] = [];
  const inpIssues: string[] = [];
  let fidScore = 100;
  let inpScore = 100;

  // Check for heavy JavaScript
  const scripts = doc.querySelectorAll('script[src]');
  const inlineScripts = doc.querySelectorAll('script:not([src])');

  let totalInlineScriptSize = 0;
  inlineScripts.forEach((script) => {
    totalInlineScriptSize += (script.textContent || '').length;
  });

  if (scripts.length > EXTERNAL_SCRIPTS_MAX) {
    fidFactors.push(`${scripts.length} external scripts`);
    fidIssues.push('Consider reducing number of external scripts');
    fidScore -= 15;
  }

  if (totalInlineScriptSize > INLINE_SCRIPT_SIZE_MAX) {
    fidFactors.push('Large inline JavaScript');
    fidIssues.push('Consider moving inline scripts to external files');
    fidScore -= 10;
  }

  // Check for async/defer usage
  const asyncScripts = doc.querySelectorAll('script[async]');
  const deferScripts = doc.querySelectorAll('script[defer]');

  if (asyncScripts.length > 0 || deferScripts.length > 0) {
    fidFactors.push('Using async/defer scripts');
    fidScore += 10;
  }

  // Check for heavy event listeners patterns
  if (/addEventListener\s*\([^)]*scroll/gi.test(html)) {
    inpFactors.push('Scroll event listeners detected');
    inpIssues.push('Ensure scroll handlers are debounced/throttled');
    inpScore -= 5;
  }

  // Check for long tasks indicators
  const heavyLibraries = [
    { pattern: /moment\.js/i, name: 'Moment.js (consider lighter alternative)' },
    { pattern: /lodash\.js/i, name: 'Full Lodash (consider modular imports)' },
    { pattern: /jquery.*\.js/i, name: 'jQuery' },
  ];

  heavyLibraries.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      inpFactors.push(name);
      inpScore -= 5;
    }
  });

  // Check for Web Workers usage (positive)
  if (/new Worker\(/i.test(html)) {
    fidFactors.push('Web Workers detected (good for offloading work)');
    fidScore += 10;
  }

  // Determine estimates
  const fidEstimate: FidEstimate['estimate'] =
    fidScore >= 80 ? 'good' : fidScore >= 50 ? 'needs-improvement' : 'poor';

  const inpEstimate: InpEstimate['estimate'] =
    inpScore >= 80 ? 'good' : inpScore >= 50 ? 'needs-improvement' : 'poor';

  return {
    fid: {
      estimate: fidEstimate,
      factors: fidFactors,
      issues: fidIssues,
    },
    inp: {
      estimate: inpEstimate,
      factors: inpFactors,
      issues: inpIssues,
    },
  };
}

/**
 * Analyzes Core Web Vitals estimates.
 */
export function analyzeCoreWebVitals(doc: Document, html: string): CoreWebVitalsAnalysis {
  const lcp = estimateLcp(doc, html);
  const cls = estimateCls(doc);
  const { fid, inp } = estimateInteractivity(doc, html);
  const recommendations: string[] = [];

  // Collect all issues as recommendations
  recommendations.push(...lcp.issues);
  recommendations.push(...cls.issues);
  recommendations.push(...fid.issues);
  recommendations.push(...inp.issues);

  // Determine overall status
  const estimates = [lcp.estimate, cls.estimate, fid.estimate, inp.estimate];
  const poorCount = estimates.filter((e) => e === 'poor').length;
  const needsImprovementCount = estimates.filter((e) => e === 'needs-improvement').length;

  let overallStatus: SeoStatus = 'good';
  if (poorCount >= 2) {
    overallStatus = 'error';
  } else if (poorCount >= 1 || needsImprovementCount >= 2) {
    overallStatus = 'warning';
  }

  return {
    lcp,
    cls,
    fid,
    inp,
    overallStatus,
    recommendations: [...new Set(recommendations)],
  };
}
