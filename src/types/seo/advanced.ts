/**
 * @fileoverview Advanced analysis types - rendering, accessibility, CWV.
 */

import type { SeoStatus } from '@/types/seo/base';

/** Rendering detection indicator */
export interface RenderingIndicator {
  type: 'ssr' | 'csr';
  indicator: string;
  weight: number;
}

/** Rendering type analysis */
export interface RenderingAnalysis {
  renderingType: 'ssr' | 'csr' | 'hybrid' | 'static' | 'unknown';
  confidence: number;
  indicators: RenderingIndicator[];
  hasNoscriptFallback: boolean;
  noscriptContent: string | null;
  appContainerEmpty: boolean;
  hydrationMarkers: string[];
  issues: string[];
  status: SeoStatus;
}

/** Lazy content and infinite scroll analysis */
export interface LazyContentAnalysis {
  hasInfiniteScroll: boolean;
  infiniteScrollPatterns: string[];
  hasLazyImages: boolean;
  lazyImageCount: number;
  hasLazyIframes: boolean;
  lazyIframeCount: number;
  hasIntersectionObserver: boolean;
  hasPagination: boolean;
  paginationLinks: string[];
  issues: string[];
  recommendations: string[];
  status: SeoStatus;
}

/** Social platform share detection */
export interface SocialPlatformShare {
  platform: string;
  detected: boolean;
  type: 'button' | 'widget' | 'link' | 'sdk';
}

/** Social share buttons analysis */
export interface SocialShareAnalysis {
  hasShareButtons: boolean;
  platforms: SocialPlatformShare[];
  shareWidgets: string[];
  nativeShareApi: boolean;
  issues: string[];
  status: SeoStatus;
}

/** Accessibility analysis */
export interface AccessibilityAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    rule: string;
    message: string;
    count: number;
    wcagLevel: 'A' | 'AA' | 'AAA';
    wcagCriteria: string;
  }>;
  passed: Array<{ rule: string; description: string }>;
  landmarks: {
    hasMain: boolean;
    hasNav: boolean;
    hasHeader: boolean;
    hasFooter: boolean;
    hasAside: boolean;
    landmarks: string[];
  };
  aria: {
    ariaLabels: number;
    ariaDescribedby: number;
    ariaHidden: number;
    roles: string[];
    liveRegions: number;
  };
  forms: {
    totalInputs: number;
    inputsWithLabels: number;
    inputsWithPlaceholderOnly: number;
    requiredFields: number;
    requiredWithAriaRequired: number;
  };
  contrast: {
    lightTextOnLight: number;
    potentialIssues: number;
  };
  status: SeoStatus;
}

/** Core Web Vitals estimation */
export interface CoreWebVitalsAnalysis {
  lcp: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: Array<{ factor: string; impact: string; description: string }>;
    largestElement: string | null;
    issues: string[];
  };
  cls: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: Array<{ factor: string; impact: string; count: number }>;
    issues: string[];
  };
  fid: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: string[];
    issues: string[];
  };
  inp: {
    estimate: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    factors: string[];
    issues: string[];
  };
  overallStatus: SeoStatus;
  recommendations: string[];
}
